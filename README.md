# OpenClaw Himalaya Skill

> Send emails from OpenClaw using himalaya CLI

[![npm version](https://img.shields.io/npm/v/openclaw-skill-himalaya)](https://www.npmjs.com/package/openclaw-skill-himalaya)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This OpenClaw skill enables AI-powered email sending through the [himalaya](https://github.com/pimalaya/himalaya) CLI email client. It supports QQ Mail, Gmail, Outlook, and other IMAP/SMTP providers.

## Features

- 📧 Send emails via himalaya CLI
- 🌍 Support for QQ Mail, Gmail, Outlook, and more
- 🔒 Secure password management (keyring/pass)
- 📝 Automatic handling of Chinese/Unicode content
- 💾 Save copies of sent messages

## Installation

```bash
# Install himalaya
brew install himalaya

# Install the skill
clawhub install openclaw-skill-himalaya
```

## Quick Start

1. Configure himalaya with your email account:
   ```bash
   himalaya account configure
   ```

2. Or manually create `~/.config/himalaya/config.toml`:
   ```toml
   [accounts.qqmail]
   default = true
   email = "your-email@qq.com"

   backend.type = "imap"
   backend.host = "imap.qq.com"
   backend.port = 993
   backend.encryption.type = "tls"
   backend.login = "your-email@qq.com"
   backend.auth.type = "password"
   backend.auth.cmd = "pass show qqmail-imap"

   message.send.backend.type = "smtp"
   message.send.backend.host = "smtp.qq.com"
   message.send.backend.port = 465
   message.send.backend.encryption.type = "tls"
   message.send.backend.login = "your-email@qq.com"
   message.send.backend.auth.type = "password"
   message.send.backend.auth.cmd = "pass show qqmail-smtp"
   ```

3. Use from OpenClaw:
   ```
   You: Send email to friend@example.com with subject "Hello" and body "Testing himalaya skill!"
   ```

## QQ Mail Setup

1. Enable IMAP/SMTP in QQ Mail settings
2. Generate an authorization code (Settings → Account → POP3/IMAP/SMTP Service)
3. Use the authorization code in your config (not your password)

## Configuration Reference

See [SKILL.md](./SKILL.md) for detailed configuration options.

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint
```

## License

MIT

## Links

- [himalaya CLI](https://github.com/pimalaya/himalaya)
- [OpenClaw](https://github.com/openclaw/openclaw)
- [OpenClaw Dev Guide](https://github.com/MindDock/OpenClaw-Dev-Guide)
