import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { EmailSendParams, ToolResult } from './types.js';

/**
 * Check if himalaya is installed and accessible
 */
function checkHimalayaInstalled(): boolean {
  const commonPaths = [
    join(homedir(), '.homebrew', 'bin', 'himalaya'),
    join('/opt', 'homebrew', 'bin', 'himalaya'),
    join('/usr', 'local', 'bin', 'himalaya'),
  ];

  return commonPaths.some((path) => existsSync(path));
}

/**
 * Check if himalaya config exists
 */
function checkConfigExists(account?: string): boolean {
  const configPath = join(homedir(), '.config', 'himalaya', 'config.toml');
  return existsSync(configPath);
}

/**
 * Execute himalaya command to send email
 */
async function executeHimalaya(
  args: string[],
  stdin?: string
): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
  return new Promise((resolve, reject) => {
    const proc = spawn('himalaya', args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode });
    });

    proc.on('error', (error) => {
      reject(error);
    });

    if (stdin) {
      proc.stdin.write(stdin);
      proc.stdin.end();
    }
  });
}

/**
 * Parse recipient addresses
 * Supports "Name <email>" format and plain email
 */
function parseRecipient(recipient: string): string {
  const emailMatch = recipient.match(/<([^>]+)>/);
  return emailMatch ? emailMatch[1] : recipient;
}

/**
 * Send email using himalaya CLI
 */
export async function sendEmail(params: EmailSendParams): Promise<ToolResult> {
  // Check prerequisites
  if (!checkHimalayaInstalled()) {
    return {
      success: false,
      error: 'himalaya CLI not found. Install with: brew install himalaya',
      code: 'HIMALAYA_NOT_FOUND',
    };
  }

  if (!checkConfigExists(params.account)) {
    return {
      success: false,
      error: 'himalaya config not found. Run: himalaya account configure',
      code: 'CONFIG_NOT_FOUND',
    };
  }

  try {
    // Build himalaya send command arguments
    const args: string[] = ['send'];

    // Add account option if specified
    if (params.account) {
      args.push('--account', params.account);
    }

    // Add recipients
    params.to.forEach((recipient) => {
      args.push('--to', parseRecipient(recipient));
    });

    // Add CC recipients if provided
    if (params.cc && params.cc.length > 0) {
      params.cc.forEach((recipient) => {
        args.push('--cc', parseRecipient(recipient));
      });
    }

    // Add BCC recipients if provided
    if (params.bcc && params.bcc.length > 0) {
      params.bcc.forEach((recipient) => {
        args.push('--bcc', parseRecipient(recipient));
      });
    }

    // Add subject
    args.push('--subject', params.subject);

    // Execute himalaya
    // himalaya uses $EDITOR for composing, but we can pipe content via stdin
    const result = await executeHimalaya(args, params.body);

    if (result.exitCode === 0) {
      return {
        success: true,
        message: `Email sent successfully to ${params.to.join(', ')}`,
        data: {
          recipients: params.to,
          subject: params.subject,
        },
      };
    } else {
      return {
        success: false,
        error: result.stderr || 'Failed to send email',
        code: 'SEND_FAILED',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'EXECUTION_ERROR',
    };
  }
}
