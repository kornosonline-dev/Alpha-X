<div align="center">

#  ALPHA X — WhatsApp Bot

**An Expressive Message System WhatsApp Bot built on Baileys**

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20%20%3C26-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Baileys](https://img.shields.io/badge/Baileys-WhiskeySockets-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Module](https://img.shields.io/badge/type-ESM-yellow?style=for-the-badge)

</div>

---

## 📖 About The Project

**ALPHA X** is a full-featured, multi-purpose WhatsApp bot built with the [`@whiskeysockets/baileys`](https://github.com/WhiskeySockets/Baileys) library (aliased as `wileys` in the project's dependencies). It connects to WhatsApp using a **pairing code** (no QR code needed), auto-loads its commands and systems at runtime, and ships with a large, ready-to-use command library covering AI chat, group administration, media/sticker creation, image generation, an in-chat economy, Islamic content, mini-games, and automated group protection.

The bot is written entirely in modern JavaScript (ESM — `"type": "module"`) and is designed to run continuously on a VPS, automatically reconnecting on disconnection and hot-reloading commands whenever files inside `commands/` or `lib/` change.

---

## ⚙️ How It Works

- **`index.js`** boots the WhatsApp socket via Baileys, requests a **pairing code** for the configured phone number, listens for incoming messages/group events, and pushes every event into a **per-chat queue** (`enqueue`) so messages from the same chat are always processed in order without blocking other chats.
- **`main.js`** is the core dispatcher:
  - Loads a local JSON database (`lib/database.js`) on startup.
  - Auto-discovers and hot-reloads every file in `commands/` and `lib/` using `chokidar` (file watcher) — no restart needed when you add or edit a command.
  - Runs all "automatic systems" from `lib/` (anti-link, anti-spam, welcome messages, leveling, games, sticker tools, etc.) on every incoming event **before** checking for a command.
  - Parses the message prefix, resolves the command (including aliases), and enforces command flags such as `owner`, `elite`, `admin`, `premium`, `group`, `private`, `botAdmin`, `disabled`, and `lockcmd`.
  - Applies **rate limiting** (2 seconds between commands per user) and increments each user's command counter in the database.
  - Automatically cleans stale files from the `temp/` folder every 10 minutes.
- **`config.js`** centralizes bot identity, owner/elite numbers, command prefixes, session path, and API keys (Gemini/OpenAI).
- Each file inside **`commands/`** exports a single command object (`name`, `aliases`, `description`, `category`, permission flags, and an `execute` function), making the command set fully modular and easy to extend.

---

## ✨ Features

### 🤖 AI & Anime Character Chat
Roleplay conversations powered by the Gemini API with anime/fictional personas (e.g. King Arthur, Obito, Itachi, Sasuke, Eren, Son Goku, Hinata, and more).

### 🎨 AI Image & Design Generation
Fully programmatic, canvas-rendered graphics: neon gaming logos, cyberpunk 3D logos, gold/metallic logos, comic-book and pop-art style logos, Marvel-style cinematic logos, Dragon Ball–style artwork, fiery/frozen text effects, graffiti-style text, plus AI drawing, image upscaling, meme generation, and image-matching tools.

### 🖼️ Sticker Toolkit
Create stickers from images, GIFs, or short videos (including animated stickers), convert stickers back to images, build stickers from anime character names, generate quote-style stickers, merge emojis ("Emoji Kitchen"), download whole Telegram sticker packs, add pack/author credits, and send random sticker/dice packs.

### 😄 Anime Reaction GIFs
Send reaction GIFs (cry, hug, slap, dance, laugh, angry, scared, bite, "baka") targeted at another member.

### 🛡️ Automated Group Protection
Toggleable, always-on group guards: anti-link, anti-spam, anti-swear, and anti-fake-account detection — with automatic warnings, message deletion, and auto-kick after repeated violations.

### 👮 Group Administration
Promote/demote members, kick, mute/unmute, warn, delete messages, mention everyone, view/lock chat, manage join requests, change group name/description/picture, view group rules, and fetch the group invite link.

### ⚙️ Group Automation Settings
Toggle welcome messages, auto-emoji reactions, promotion/demotion notifications, group-change detection, and auto-approval systems per group.

### 💰 Economy & Leveling System
Daily and weekly reward claims, point transfers between users, a leaderboard ("richest accounts"), personal/other-user account stats, and an XP/level ranking system.

### 🕌 Islamic Content
Send Quran verses, morning/evening Adhkar, simplified Tafsir, Hadith, and city-based prayer times.

### 🎮 Mini-Games
Tic-tac-toe (vs. another player or vs. the bot's AI), a math challenge game, and a casino-style luck game.

### 🔎 Search, Download & Utility Tools
Google search, YouTube song downloads, APK app search/download, TikTok video downloads, TikTok character edits, text translation, calendar lookup, weather lookup, view-once media reveal, text-to-speech, decorative text/number styling, suspicious-link detection, and "who's online" tracking.

### 🧰 Owner / Bot Management
Bot speed & status test, restart, shutdown, prefix management, premium activation, command inspection/patch tools, and group "leave" command — restricted to the owner and elite users.

### ⚠️ Advanced Group Prank/Takeover Commands (Owner/Elite only)
A "Zarf" module that can rebrand a group (name, description, picture), broadcast a custom message and voice note, and remove all members except the developer and elite users. These commands are gated behind owner/elite permissions and are intended for the bot operator's own groups.

### 🔄 Live Hot-Reloading
Commands and automatic systems are watched with `chokidar` and reloaded on the fly without restarting the bot process.

### 🔁 Smart Auto-Reconnect
Exponential backoff reconnection logic (up to 10 attempts, capped at 60 seconds) that automatically re-establishes the WhatsApp connection after a drop, while respecting a logged-out state.

---

## 📋 Requirements

- **Node.js** `>= 20` and `< 26` (as declared in `package.json`)
- **npm** (for dependency installation)
- **FFmpeg** installed and available on the system `PATH` (required by `fluent-ffmpeg` for audio/video/sticker processing)
- Build tools for native modules (`canvas`, `@napi-rs/canvas`, `sharp`, `node-webpmux`) — on Linux this typically means `build-essential`, `libcairo2-dev`, `libpango1.0-dev`, `libjpeg-dev`, `libgif-dev`, and `librsvg2-dev`
- Python 3 (used by `speed.py` for network latency checks)
- A WhatsApp account/phone number to link the bot to
- A [Google Gemini API key](https://ai.google.dev/) (optional, required for AI chat commands)

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/alpha-x.git
   cd alpha-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install FFmpeg** (if not already installed)
   ```bash
   # Debian/Ubuntu
   sudo apt update && sudo apt install ffmpeg -y

   # macOS
   brew install ffmpeg
   ```

4. **Configure the bot** — open `config.js` and fill in your own details:
   ```js
   export default {
       ownerName: 'YourName',
       ownerNumber: '<your-number>@s.whatsapp.net',
       eliteNumbers: ['<trusted-number>@s.whatsapp.net'],
       botName: 'ALPHA X',
       mode: 'Public',            // Public | Private | Self
       prefix: ['.', '!', '#', '•', '*', '/'],
       botVersion: '2.0.0',
       sessionPath: './session',
       botNumber: '<bot-number>@s.whatsapp.net',
       geminiKey: '<your-gemini-api-key>',
       openAIKey: ''
   };
   ```

---

## ▶️ Usage

1. **Start the bot**
   ```bash
   npm start
   ```
   (equivalent to `node index.js`)

2. **Link your WhatsApp number** — on first run, the terminal will prompt:
   ```
   Your Number Phone:
   ```
   Enter your WhatsApp number (with country code, no `+`). The bot will generate a **pairing code** — enter it in WhatsApp under *Linked Devices → Link with phone number*.

3. Once connected, the console displays a status banner confirming the bot is **Online**, along with its current mode and version. Session credentials are stored under the folder configured in `sessionPath` (default: `./session`) so you won't need to re-pair on every restart.

4. **Send a command** in any chat the bot has access to, using any of the configured prefixes, e.g.:
   ```
   .اوامر
   ```

---

## 📂 Project Structure

```
alpha-x/
├── index.js               # Entry point — WhatsApp connection, pairing, reconnection logic
├── main.js                 # Core command dispatcher, permission engine, hot-reload system
├── config.js                # Bot identity, owner/elite numbers, prefixes, API keys
├── speed.py                  # Python helper script to measure network latency to public DNS/WhatsApp
├── package.json                # Project metadata & dependencies
├── commands/                    # All bot commands (100+ .js files), one command per file
├── lib/                           # Automatic systems & shared modules
│   ├── automatic.js                 # Leveling / auto-role / group automation engine
│   ├── chanel.js                      # Auto-injects a WhatsApp channel forward tag into outgoing messages
│   ├── database.js                     # Lightweight JSON-based database (users, chats, settings)
│   ├── games.js                          # Mini-games engine (tic-tac-toe, etc.)
│   ├── persist.js                          # Kick-tracking persistence helper (src/zarf/data.json)
│   ├── security.js                          # Anti-link / anti-spam / anti-swear / private-chat guard
│   └── sticker.js                            # Sticker creation/conversion helpers (FFmpeg + webpmux)
├── src/
│   ├── json/db.json                            # Persistent bot database (users, chats, global settings)
│   ├── media/                                    # Bundled media assets (e.g. menu images)
│   └── zarf/
│       ├── ZARF.js                                 # Configurable "group rebrand" content/templates
│       └── data.json                                 # Kick-tracking data store
└── temp/                                               # Temporary file storage (auto-cleaned every 10 min)
```

> `session/` and `node_modules/` are created automatically at runtime/install and should be excluded from version control.

---

## 💬 Command Examples

The bot supports multiple prefixes: `.` `!` `#` `•` `*` `/`

| Command (Arabic) | Description |
|---|---|
| `.اوامر` | Show the full list of available commands |
| `.تست` | Show bot status and response speed |
| `.السرعة` | Measure bot/server latency |
| `.ترجمة <text>` | Translate text to another language |
| `.الطقس <city>` | Get the current weather for a city |
| `.اغنية <name>` | Download a song from YouTube |
| `.تيك <link>` | Download a TikTok video |
| `.ملصق <character>` | Generate a sticker from an anime character name |
| `.لملصق` | Convert a replied image into a sticker |
| `.ارسم <prompt>` | Generate an AI image |
| `.حسابي` | View your economy account (level, coins, bank) |
| `.يومي` | Claim your daily reward |
| `.ترتيب` | View the richest-accounts leaderboard |
| `.اكس_بوت` | Play Tic-Tac-Toe against the bot |
| `.اية` | Send a random Quran verse |
| `.مواقيت <city>` | Get prayer times for a city |
| `.كتم @user` | Mute a group member *(admin only)* |
| `.طرد @user` | Remove a member from the group *(admin only)* |

---

## 📝 Important Notes

- The bot uses a **pairing code**, not a QR code (`printQRInTerminal: false` in `index.js`), so a valid phone number is required at startup.
- `mode` in `config.js` controls bot visibility: `Public` (anyone can use it), `Private` (only owner/elite/premium users), or `Self` (only the owner).
- Commands can be individually restricted via flags such as `owner`, `elite`, `admin`, `premium`, `group`, `private`, `botAdmin`, `disabled`, and `lockcmd` — these are read and enforced centrally by `main.js`.
- A built-in **rate limiter** blocks non-owner users from issuing more than one command every 2 seconds.
- The bot automatically injects a WhatsApp channel-forward tag into outgoing messages (see `lib/chanel.js`) — update or remove the channel IDs there if you don't want this behavior.
- All persistent data (users, chats, global settings) is stored in a flat JSON file rather than a traditional database — suitable for small-to-medium deployments, but consider migrating to a proper database for high-traffic bots.
- The "Zarf" group-rebrand/takeover commands (category `ق14`) are powerful and irreversible for the affected group — they are gated to owner/elite permissions by design and should be used responsibly and only on groups you own or manage.
- Never commit your `config.js` API keys, `session/` folder, or `src/json/db.json` to a public repository, as they contain sensitive credentials and personal data.

---

## 👨‍💻 Developer

**Ayoub**
Independent full-stack & bot developer — building and maintaining ALPHA X.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Ayoub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
