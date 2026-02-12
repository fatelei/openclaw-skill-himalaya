# Himalaya Email Skill

> Send emails directly from OpenClaw using himalaya CLI

## Overview

This skill allows OpenClaw to send emails via the himalaya CLI email client. It supports multiple email providers including QQ Mail, Gmail, Outlook, and any IMAP/SMTP compatible service.

## Installation

### Prerequisites

1. Install [himalaya](https://github.com/pimalaya/himalaya):
   ```bash
   brew install himalaya  # macOS
   ```

2. Configure your email account (see Configuration section below)

3. Install this skill:
   ```bash
   openclaw skills install openclaw-skill-himalaya
   ```

## Configuration

### Option 1: Interactive Setup (Recommended)

Run the himalaya configuration wizard:
```bash
himalaya account configure
```

### Option 2: Manual Configuration

Create `~/.config/himalaya/config.toml`:

```toml
[accounts.qqmail]
default = true
email = "your-email@qq.com"

# IMAP configuration
backend.type = "imap"
backend.host = "imap.qq.com"
backend.port = 993
backend.encryption.type = "tls"
backend.login = "your-email@qq.com"
backend.auth.type = "password"
backend.auth.cmd = "pass show qqmail-imap"

# SMTP configuration (for sending)
message.send.backend.type = "smtp"
message.send.backend.host = "smtp.qq.com"
message.send.backend.port = 465
message.send.backend.encryption.type = "tls"
message.send.backend.login = "your-email@qq.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.cmd = "pass show qqmail-smtp"

# Save sent messages
message.send.save-copy = true
```

### QQ Mail Specific Notes

1. Enable IMAP/SMTP in QQ Mail settings
2. Generate an authorization code (not your password):
   - Settings -> Account -> POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV Service
   - Click "Generate Authorization Code"
   - Send SMS to verify
   - Copy the generated code

### Other Providers

**Gmail:**
- IMAP: `imap.gmail.com:993`
- SMTP: `smtp.gmail.com:465` or `587`
- Use App Password instead of regular password

**Outlook:**
- IMAP: `outlook.office365.com:993`
- SMTP: `smtp-mail.outlook.com:587`

## Usage

Once configured, OpenClaw can send emails for you:

```
You: Send an email to john@example.com with subject "Meeting Tomorrow" and body "Let's meet at 2pm"

OpenClaw: I'll send that email for you.

[Email sent successfully to john@example.com]
```

### Advanced Usage

```
You: Email sarah@example.com and mike@company.com about the project update

OpenClaw: I'll compose an email to both recipients.
```

## Security Best Practices

1. **Never hardcode passwords** - Use keyring or password managers
2. **Use authorization codes** for services that support them (like QQ Mail)
3. **Enable 2FA** on your email accounts
4. **Use environment-specific accounts** for development/testing

## Troubleshooting

### "himalaya not found"
Install himalaya: `brew install himalaya`

### Authentication failed
- Verify your credentials in `~/.config/himalaya/config.toml`
- For QQ Mail, ensure you're using the authorization code, not your password
- Check that IMAP/SMTP is enabled in your email settings

### Permission denied
Check file permissions on `~/.config/himalaya/config.toml`

## License

MIT

## Sources

- [himalaya GitHub](https://github.com/pimalaya/himalaya)
- [OpenClaw Skills Guide](https://github.com/MindDock/OpenClaw-Dev-Guide)
- [QQ Mail IMAP/SMTP Settings](https://service.mail.qq.com/cgi-bin/help?subtype=1&id=28&no=1001256)
