const form = document.querySelector("#reaction-form");
const linkInput = document.querySelector("#channel-link");
const emojiInput = document.querySelector("#emoji-input");
const emojiCount = document.querySelector("#emoji-count");
const errorBox = document.querySelector("#form-error");
const submitButton = document.querySelector("#submit-button");
const resultPanel = document.querySelector("#result-panel");

function getUniqueEmoji(value) {
  const parts = [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(value)]
    .map(part => part.segment)
    .filter(part => /\p{Extended_Pictographic}/u.test(part));
  return [...new Set(parts)];
}

function updateCount() {
  const count = getUniqueEmoji(emojiInput.value).length;
  emojiCount.textContent = `${count} / 15`;
  emojiCount.style.color = count > 15 ? "#ff9eb7" : "";
}
emojiInput.addEventListener("input", updateCount);

document.querySelectorAll("[data-emoji]").forEach(button => {
  button.addEventListener("click", () => {
    emojiInput.value += button.dataset.emoji;
    updateCount();
    emojiInput.focus();
  });
});

function setText(id, value) {
  document.querySelector(`#${id}`).textContent =
    value === null || value === undefined || value === "" ? "—" : String(value);
}

function showResult(data) {
  resultPanel.hidden = false;
  const success = data.status === true;
  const pill = document.querySelector("#status-pill");
  pill.textContent = success ? "SUCCESS" : "FAILED";
  pill.className = `status-pill ${success ? "ok" : "bad"}`;
  setText("result-message", data.message || data.error || "Tidak ada pesan dari provider.");
  setText("result-total", data.total);
  setText("result-success", data.successful);
  const link = document.querySelector("#result-link");
  link.textContent = data.link || "—";
  link.href = data.link || "#";
  setText("result-emojis", Array.isArray(data.emojis) ? data.emojis.join(" ") : data.emojis);
  setText("quota-plan", data.quota?.plan);
  setText("quota-limit", data.quota?.limit);
  setText("quota-remaining", data.quota?.remaining);
  setText("quota-reset", data.quota?.reset);
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  errorBox.hidden = true;
  const emojis = getUniqueEmoji(emojiInput.value);
  if (!linkInput.value.trim()) {
    errorBox.textContent = "Link WhatsApp wajib diisi.";
    errorBox.hidden = false;
    return;
  }
  if (!emojis.length) {
    errorBox.textContent = "Masukkan minimal satu emoji.";
    errorBox.hidden = false;
    return;
  }
  if (emojis.length > 15) {
    errorBox.textContent = "Maksimal 15 emoji unik.";
    errorBox.hidden = false;
    return;
  }

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Menghubungi provider…";
  try {
    const response = await fetch("/api/reaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: linkInput.value.trim(), emoji: emojis.join("") })
    });
    const data = await response.json();
    showResult(data);
    if (!response.ok && data.status !== false) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
  } catch (error) {
    errorBox.textContent = error.message || "Permintaan gagal. Coba lagi nanti.";
    errorBox.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Kirim permintaan";
  }
});

document.querySelector("#copy-result").addEventListener("click", async () => {
  const text = [
    "XIYU CODEX — HASIL PROVIDER",
    `Status: ${document.querySelector("#status-pill").textContent}`,
    `Pesan: ${document.querySelector("#result-message").textContent}`,
    `Link: ${document.querySelector("#result-link").textContent}`,
    `Emoji: ${document.querySelector("#result-emojis").textContent}`,
    `Total: ${document.querySelector("#result-total").textContent}`,
    `Berhasil: ${document.querySelector("#result-success").textContent}`,
    `Plan: ${document.querySelector("#quota-plan").textContent}`,
    `Batas kuota: ${document.querySelector("#quota-limit").textContent}`,
    `Sisa kuota: ${document.querySelector("#quota-remaining").textContent}`,
    `Reset: ${document.querySelector("#quota-reset").textContent}`
  ].join("\n");
  const button = document.querySelector("#copy-result");
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Tersalin ✓";
  } catch {
    button.textContent = "Gagal menyalin";
  }
  setTimeout(() => button.textContent = "Salin ringkasan", 1800);
});
