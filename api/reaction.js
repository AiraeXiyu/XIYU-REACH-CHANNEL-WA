import { validateWhatsAppLink, parseEmojis } from "../src/validator.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ status: false, error: "Method not allowed" });
  }

  try {
    const link = validateWhatsAppLink(req.body?.link);
    const emojis = parseEmojis(req.body?.emoji, 15);

    const endpoint = new URL("https://api-cloud.my.id/tools/rchv2");
    endpoint.searchParams.set("link", link);
    endpoint.searchParams.set("emoji", emojis.join(""));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let upstream;
    let raw;
    try {
      upstream = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      raw = await upstream.text();
    } finally {
      clearTimeout(timeout);
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(502).json({
        status: false,
        error: "Provider returned a non-JSON response.",
        http_status: upstream.status
      });
    }

    const result = data?.result ?? {};
    const quota = data?.quota ?? {};
    const payload = {
      status: data?.status === true,
      app: "XIYU CODEX",
      message: result.message ?? data?.error ?? "Provider response received.",
      link: result.link ?? link,
      emojis: Array.isArray(result.emoji) ? result.emoji : emojis,
      total: Number.isFinite(Number(result.total)) ? Number(result.total) : 0,
      successful: Number.isFinite(Number(result.sukses)) ? Number(result.sukses) : 0,
      quota: {
        plan: quota.plan ?? null,
        limit: Number.isFinite(Number(quota.limit)) ? Number(quota.limit) : null,
        remaining: Number.isFinite(Number(quota.remaining)) ? Number(quota.remaining) : null,
        reset: quota.reset ?? null
      }
    };

    return res.status(upstream.ok ? 200 : 502).json(payload);
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({
        status: false,
        error: "Provider request timed out. Please try again later."
      });
    }
    return res.status(400).json({
      status: false,
      error: error?.message || "Request could not be processed."
    });
  }
}
