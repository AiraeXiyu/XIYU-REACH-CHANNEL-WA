export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: false, error: "Method not allowed" });
  }
  return res.status(200).json({
    status: true,
    app: "XIYU CODEX",
    version: "1.0.0"
  });
}
