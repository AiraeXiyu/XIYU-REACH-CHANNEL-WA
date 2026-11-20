const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

export function validateWhatsAppLink(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Link WhatsApp wajib diisi.");
  }

  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Format link tidak valid.");
  }

  const host = url.hostname.toLowerCase();
  if (!["whatsapp.com", "www.whatsapp.com", "chat.whatsapp.com"].includes(host)) {
    throw new Error("Gunakan tautan dari domain WhatsApp.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Gunakan tautan HTTPS.");
  }

  return url.toString();
}

export function parseEmojis(value, max = 15) {
  if (typeof value !== "string") {
    throw new Error("Masukkan emoji.");
  }

  const segments = [...new Intl.Segmenter("en", {
    granularity: "grapheme"
  }).segment(value)];

  const emojis = segments
    .map(item => item.segment)
    .filter(item => EMOJI_REGEX.test(item));

  const unique = [...new Set(emojis)];

  if (!unique.length) throw new Error("Masukkan minimal satu emoji.");
  if (unique.length > max) throw new Error(`Maksimal ${max} emoji unik.`);

  return unique;
}
