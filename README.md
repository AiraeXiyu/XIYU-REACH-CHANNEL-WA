
# ✦ XIYU CODEX — Reach Channel 🌸

<p align="center">
  <img src="public/logo.svg" width="110" alt="XIYU CODEX Logo">
</p>

<h3 align="center">WhatsApp Channel Request Gateway</h3>

<p align="center">
  꽃 · 星 · 花 · ✧ · 🦋 · 🌷
</p>

<p align="center">
  A cute, aesthetic, and mobile-first interface for submitting
  WhatsApp Channel reaction requests through a public provider API.
</p>

---

## 🌸 About

**XIYU CODEX — Reach Channel** is a web-based request gateway designed with a modern cosmic aesthetic, custom SVG illustrations, animated decorations, and a responsive mobile-first interface.

The application validates WhatsApp Channel post links and emoji input before forwarding a request to the configured public provider API.

### ✨ Features

- 🌷 WhatsApp Channel post link input.
- 💫 Emoji input with a maximum of 15 unique emojis.
- 🔍 URL, domain, and emoji validation.
- 🚀 One-click request submission.
- 📊 Display actual provider response.
- 🎀 Display request status and provider message.
- 🌸 Display returned link and emojis.
- ⭐ Display total and successful counts when provided.
- 🪷 Display quota plan, limit, remaining quota, and reset time when available.
- 📋 Copy result summary.
- 💜 API health check.
- 🎨 Custom SVG illustrations and decorative assets.
- 🦋 Animated flowers, stars, aurora, and floating decorations.
- 📱 Responsive mobile-first layout.

---

## 🪄 How It Works

The application uses a server-side API route to communicate with the public provider.

```text
User Input
    │
    ▼
Website Validation
    │
    ▼
POST /api/reaction
    │
    ▼
Server-side Provider Request
    │
    ▼
https://api-cloud.my.id/tools/rchv2
    │
    ▼
Provider JSON Response
    │
    ▼
Result Display
```

### Provider Endpoint

**URL**

```text
https://api-cloud.my.id/tools/rchv2
```

**Method**

```http
GET
```

**Query Parameters**

| Parameter | Description |
|---|---|
| `link` | WhatsApp Channel post URL |
| `emoji` | Emoji input |

### Internal API

The frontend communicates with the Vercel serverless function:

```http
POST /api/reaction
Content-Type: application/json
```

**Request Body**

```json
{
  "link": "https://whatsapp.com/channel/CHANNEL_ID/POST_ID",
  "emoji": "🔥😎❤️"
}
```

The server validates the input and forwards one request to the provider.

---

## 📦 Example Provider Response

The following is an illustrative response structure. Actual values are supplied by the provider.

```json
{
  "status": true,
  "result": {
    "message": "Reaksi berhasil dikirim",
    "link": "https://whatsapp.com/channel/CHANNEL_ID/POST_ID",
    "emoji": [
      "🔥"
    ],
    "total": 204,
    "sukses": 204
  },
  "quota": {
    "plan": "free",
    "limit": 2000,
    "remaining": 1999,
    "reset": "00:00 WITA"
  }
}
```

The website maps the response into these result fields:

| Field | Description |
|---|---|
| `status` | Provider request status |
| `message` | Provider response message |
| `link` | Processed WhatsApp Channel link |
| `emoji` | Emoji returned by provider |
| `total` | Total count returned by provider |
| `successful` | Successful count returned by provider |
| `plan` | Provider quota plan |
| `limit` | Provider quota limit |
| `remaining` | Remaining provider quota |
| `reset` | Provider quota reset information |

Unavailable fields are displayed as unavailable rather than replaced with fabricated values.

---

## 🛠️ Project Structure

```text
XIYU-CODEX/
│
├── api/
│   ├── health.js
│   └── reaction.js
│
├── public/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── logo.svg
│   └── art/
│       ├── flower.svg
│       └── sparkle.svg
│
├── src/
│   └── validator.js
│
├── index.html
├── package.json
├── vercel.json
└── README.md
```

---

## ⚙️ Requirements

- Node.js 20 or newer.
- npm.
- Git.
- Vercel account for deployment.

---

## 💻 Run Locally

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Enter the project directory:

```bash
cd XIYU-CODEX
```

Install Vercel CLI:

```bash
npm install -g vercel
```

Start the development server:

```bash
vercel dev
```

Open the local URL displayed in your terminal.

---

## 🚀 Deploy to Vercel

1. Upload the project to a GitHub repository.
2. Open [Vercel](https://vercel.com/).
3. Select **Add New Project**.
4. Import your GitHub repository.
5. Set Framework Preset to **Other**.
6. Set **Root Directory** to `./`.
7. Leave **Build Command** empty.
8. Set **Output Directory** to `public` (this folder contains `index.html` and the browser assets).
9. Leave **Install Command** empty/default.
10. No environment variables are required by default.
11. Click **Deploy**.

The homepage is stored at `public/index.html` so it is included when Vercel publishes the `public` output directory.

After deployment, the website and API routes will be available through your Vercel domain.

### API Routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Check API status |
| `/api/reaction` | POST | Submit a reaction request |

---

## 🔒 Request & Validation Rules

- Only HTTPS WhatsApp Channel post links are accepted.
- The accepted domain is `whatsapp.com`.
- Emoji input must contain at least one valid emoji.
- A maximum of 15 unique emojis is allowed.
- Duplicate emojis are removed during validation.
- Provider requests are made server-side.
- The provider endpoint is fixed in the server implementation.

### Request Behavior

- One submit action triggers one provider request.
- No simulated results.
- No fabricated totals or quota values.
- No automatic retry.
- No batching or background request loops.
- Results are based on the actual provider response.

---

## 🎨 Design & Visual Identity

The interface uses a custom cosmic-inspired visual system.

**Color Palette**

| Color | Hex |
|---|---|
| Deep Navy | `#090D1D` |
| Cyan | `#65DDFB` |
| Lavender | `#B7A1FF` |
| Pink | `#F4A7D7` |
| Cream | `#F7EBD8` |

**Visual Elements**

- Custom SVG logo.
- Animated SVG illustrations.
- Aurora background effects.
- Floating flower decorations.
- Twinkling stars.
- Orbit animations.
- Falling emoji particles.
- Responsive glass-style panels.

---

## ⚠️ Disclaimer

This project is an independent interface and request gateway.

WhatsApp and the external API provider are separate services. XIYU CODEX does not claim ownership of their platforms, infrastructure, or trademarks.

Use the provider API in accordance with its applicable terms and limits.

---

## © Copyright

**Copyright © 2026 XIYU CODEX. All rights reserved.**

The original source code, website interface, visual identity, SVG artwork, styles, documentation, and original project assets are protected by their respective rights.

Unauthorized redistribution, rebranding, reproduction, or presentation of the original project as another party's work is prohibited without permission.

Third-party services, trademarks, and external API infrastructure remain the property of their respective owners.

---

<p align="center">
  <b>XIYU CODEX</b>
  <br>
  Reach Channel · 꽃 · 星 · 花
  <br>
  Made with 💜 and ✨
</p>
