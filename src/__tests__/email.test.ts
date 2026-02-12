import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendEmail } from '../email.js';
import type { EmailSendParams } from '../types.js';

// Mock child_process.spawn
vi.mock('node:child_process', () => ({
  spawn: vi.fn(),
}));

// Mock fs functions
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

describe('sendEmail', () => {
  // Create fresh mock for each test
  let mockProc: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock existsSync to return true for himalaya
    vi.mocked(existsSync).mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createMockProc(exitCode: number | null, error?: Error) {
    let closeHandler: ((code: number | null) => void) | null = null;
    let errorHandler: ((err: Error) => void) | null = null;

    mockProc = {
      stdout: {
        on: vi.fn((event: string, handler: Function) => {
          // Simulate 'data' event - ignore for now as we don't test output
        }),
        write: vi.fn(),
        end: vi.fn(),
      },
      stderr: {
        on: vi.fn((event: string, handler: Function) => {
          // Simulate 'data' event - ignore for now
        }),
      },
      stdin: {
        write: vi.fn(),
        end: vi.fn(),
      },
      on: vi.fn((event: string, handler: Function) => {
        if (event === 'close') {
          closeHandler = handler as any;
        } else if (event === 'error') {
          errorHandler = handler as any;
        }
      }),
    };

    // Set up spawn to return our mock
    vi.mocked(spawn).mockReturnValue(mockProc);

    // Trigger the appropriate event after a microtask
    queueMicrotask(() => {
      if (error && errorHandler) {
        errorHandler(error);
      } else if (closeHandler) {
        closeHandler(exitCode);
      }
    });

    return mockProc;
  }

  it('should send email successfully', async () => {
    const params: EmailSendParams = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body',
    };

    createMockProc(0);

    const result = await sendEmail(params);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Email sent successfully');
    expect(spawn).toHaveBeenCalledWith('himalaya', [
      'send',
      '--to',
      'test@example.com',
      '--subject',
      'Test Subject',
    ]);
  });

  it('should handle multiple recipients', async () => {
    const params: EmailSendParams = {
      to: ['user1@example.com', 'user2@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    createMockProc(0);

    await sendEmail(params);

    expect(spawn).toHaveBeenCalledWith('himalaya', [
      'send',
      '--to',
      'user1@example.com',
      '--to',
      'user2@example.com',
      '--subject',
      'Test',
    ]);
  });

  it('should handle CC recipients', async () => {
    const params: EmailSendParams = {
      to: ['to@example.com'],
      cc: ['cc1@example.com', 'cc2@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    createMockProc(0);

    await sendEmail(params);

    expect(spawn).toHaveBeenCalledWith('himalaya', [
      'send',
      '--to',
      'to@example.com',
      '--cc',
      'cc1@example.com',
      '--cc',
      'cc2@example.com',
      '--subject',
      'Test',
    ]);
  });

  it('should handle BCC recipients', async () => {
    const params: EmailSendParams = {
      to: ['to@example.com'],
      bcc: ['bcc@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    createMockProc(0);

    await sendEmail(params);

    expect(spawn).toHaveBeenCalledWith('himalaya', [
      'send',
      '--to',
      'to@example.com',
      '--bcc',
      'bcc@example.com',
      '--subject',
      'Test',
    ]);
  });

  it('should handle account parameter', async () => {
    const params: EmailSendParams = {
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
      account: 'work',
    };

    createMockProc(0);

    await sendEmail(params);

    expect(spawn).toHaveBeenCalledWith('himalaya', [
      'send',
      '--account',
      'work',
      '--to',
      'test@example.com',
      '--subject',
      'Test',
    ]);
  });

  it('should parse "Name <email>" format', async () => {
    const params: EmailSendParams = {
      to: ['John Doe <john@example.com>'],
      subject: 'Test',
      body: 'Body',
    };

    createMockProc(0);

    await sendEmail(params);

    expect(spawn).toHaveBeenCalledWith('himalaya', [
      'send',
      '--to',
      'john@example.com',
      '--subject',
      'Test',
    ]);
  });

  it('should return error when himalaya is not installed', async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    const params: EmailSendParams = {
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    const result = await sendEmail(params);

    expect(result.success).toBe(false);
    expect(result.code).toBe('HIMALAYA_NOT_FOUND');
    expect(result.error).toContain('not found');
  });

  it('should return error when config is missing', async () => {
    // himalaya exists but config doesn't
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = String(path);
      return pathStr.includes('himalaya') && !pathStr.includes('config.toml');
    });

    const params: EmailSendParams = {
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    const result = await sendEmail(params);

    expect(result.success).toBe(false);
    expect(result.code).toBe('CONFIG_NOT_FOUND');
  });

  it('should handle send failure', async () => {
    createMockProc(1); // exit code 1

    const params: EmailSendParams = {
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    const result = await sendEmail(params);

    expect(result.success).toBe(false);
    expect(result.code).toBe('SEND_FAILED');
  });

  it('should handle spawn error', async () => {
    const error = new Error('Spawn failed');
    createMockProc(null, error);

    const params: EmailSendParams = {
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
    };

    const result = await sendEmail(params);

    expect(result.success).toBe(false);
    expect(result.code).toBe('EXECUTION_ERROR');
  });
});
