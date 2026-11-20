import { validateWhatsAppLink, parseEmojis } from "../src/validator.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ status: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const link = validateWhatsAppLink(body?.link);
    const emojis = parseEmojis(body?.emoji, 15);

    // Gateway mewajibkan KEDUA parameter: link dan emoji.
    const endpoint = new URL("https://api-cloud.my.id/tools/rchv2");
    endpoint.searchParams.set("link", link);
    endpoint.searchParams.set("emoji", emojis.join(""));

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
      return res.status(502).json({
        status: false,
        error: "Provider tidak mengembalikan JSON.",
        provider_http_status: upstream.status,
        provider_response_preview: raw.replace(/\s+/g, " ").trim().slice(0, 220) || "(empty response)"
      });
    }

    const result = data?.result ?? {};
    const quota = data?.quota ?? {};
    const payload = {
      status: data?.status === true,
      creator: data?.creator ?? null,
      app: "XIYU CODEX",
      message: result?.message ?? data?.message ?? data?.error ?? "Provider response received.",
      link: result?.link ?? link,
      emojis: Array.isArray(result?.emoji) ? result.emoji : emojis,
      total: result?.total ?? null,
      successful: result?.sukses ?? null,
      quota: {
        plan: quota?.plan ?? null,
        limit: quota?.limit ?? null,
        remaining: quota?.remaining ?? null,
        reset: quota?.reset ?? null
      }
    };

    return res.status(upstream.ok ? 200 : 502).json(payload);
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({ status: false, error: "Provider request timed out." });
    }
    return res.status(400).json({
      status: false,
      error: error?.message || "Request could not be processed."
    });
  }
}
