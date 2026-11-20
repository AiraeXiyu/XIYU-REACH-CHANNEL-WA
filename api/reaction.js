export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ status: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const link = typeof body?.link === "string" ? body.link.trim() : "";

    if (!link) {
      return res.status(400).json({ status: false, error: "Link WhatsApp wajib diisi." });
    }

    let parsedLink;
    try {
      parsedLink = new URL(link);
    } catch {
      return res.status(400).json({ status: false, error: "Format link tidak valid." });
    }

    if (parsedLink.protocol !== "https:" ||
        !["whatsapp.com", "www.whatsapp.com"].includes(parsedLink.hostname.toLowerCase()) ||
        !parsedLink.pathname.startsWith("/channel/")) {
      return res.status(400).json({
        status: false,
        error: "Gunakan link postingan WhatsApp Channel HTTPS yang valid."
      });
    }

    // Provider endpoint yang diberikan: /tools/rchv2?link=<URL>
    // Jangan menambahkan parameter emoji yang tidak tercantum pada format endpoint tersebut.
    const endpoint = new URL("https://api-cloud.my.id/tools/rchv2");
    endpoint.searchParams.set("link", link);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    let upstream;
    let raw;
    try {
      upstream = await fetch(endpoint.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "XIYU-CODEX/1.0"
        },
        signal: controller.signal
      });
      raw = await upstream.text();
    } finally {
      clearTimeout(timeout);
    }

    let data;
    try {
      data = JSON.parse(raw.replace(/^\uFEFF/, "").trim());
    } catch {
      const contentType = upstream.headers.get("content-type") || "unknown";
      const preview = raw.replace(/\s+/g, " ").trim().slice(0, 220);
      return res.status(502).json({
        status: false,
        error: "Provider tidak mengembalikan JSON.",
        provider_http_status: upstream.status,
        provider_content_type: contentType,
        provider_response_preview: preview || "(empty response)"
      });
    }

    const result = data?.result ?? {};
    const payload = {
      status: data?.status === true,
      creator: data?.creator ?? null,
      app: "XIYU CODEX",
      message: result?.message ?? data?.message ?? data?.error ?? "Provider response received.",
      link: result?.link ?? link,
      emojis: Array.isArray(result?.emoji) ? result.emoji : []
    };

    // Tambahkan hanya jika memang disediakan oleh provider.
    if (result?.total !== undefined) payload.total = result.total;
    if (result?.sukses !== undefined) payload.successful = result.sukses;
    if (data?.quota !== undefined) payload.quota = data.quota;

    return res.status(upstream.ok ? 200 : 502).json(payload);
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({
        status: false,
        error: "Provider request timed out."
      });
    }
    return res.status(500).json({
      status: false,
      error: error?.message || "Request could not be processed."
    });
  }
}
