import { describe, it, expect, vi } from 'vitest';
import { createHimalayaTool } from '../index.js';

// Mock the email module
vi.mock('../email.js', () => ({
  sendEmail: vi.fn(),
}));

import { sendEmail } from '../email.js';

describe('createHimalayaTool', () => {
  it('should create tool with correct name and description', () => {
    const tool = createHimalayaTool();

    expect(tool.name).toBe('email_send');
    expect(tool.description).toContain('himalaya CLI');
    expect(tool.description).toContain('QQ Mail');
  });

  it('should have TypeBox parameters', () => {
    const tool = createHimalayaTool();

    expect(tool.parameters).toBeDefined();
    expect(tool.parameters.type).toBe('object');
  });

  it('should return error when recipients are missing', async () => {
    const tool = createHimalayaTool();

    const result = await tool.execute({
      args: {
        subject: 'Test',
        body: 'Body',
      },
      context: {} as any,
    });

    expect(result.type).toBe('error');
    expect(result.error?.message).toContain('recipient');
  });

  it('should return error when subject is missing', async () => {
    const tool = createHimalayaTool();

    const result = await tool.execute({
      args: {
        to: ['test@example.com'],
        body: 'Body',
      },
      context: {} as any,
    });

    expect(result.type).toBe('error');
    expect(result.error?.message).toContain('subject');
  });

  it('should return error when body is missing', async () => {
    const tool = createHimalayaTool();

    const result = await tool.execute({
      args: {
        to: ['test@example.com'],
        subject: 'Test',
      },
      context: {} as any,
    });

    expect(result.type).toBe('error');
    expect(result.error?.message).toContain('body');
  });

  it('should call sendEmail with correct parameters', async () => {
    const mockSendEmail = vi.mocked(sendEmail);
    mockSendEmail.mockResolvedValue({
      success: true,
      message: 'Email sent successfully',
      data: {
        recipients: ['test@example.com'],
        subject: 'Test',
      },
    });

    const tool = createHimalayaTool();

    const result = await tool.execute({
      args: {
        to: ['test@example.com'],
        subject: 'Test Subject',
        body: 'Test Body',
      },
      context: {} as any,
    });

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body',
    });

    expect(result.type).toBe('success');
    expect(result.text).toContain('Email sent successfully');
  });

  it('should return error when sendEmail fails', async () => {
    const mockSendEmail = vi.mocked(sendEmail);
    mockSendEmail.mockResolvedValue({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED',
    });

    const tool = createHimalayaTool();

    const result = await tool.execute({
      args: {
        to: ['test@example.com'],
        subject: 'Test',
        body: 'Body',
      },
      context: {} as any,
    });

    expect(result.type).toBe('error');
    expect(result.error?.message).toContain('Authentication failed');
    expect(result.error?.code).toBe('AUTH_FAILED');
  });

  it('should handle CC and BCC parameters', async () => {
    const mockSendEmail = vi.mocked(sendEmail);
    mockSendEmail.mockResolvedValue({
      success: true,
      message: 'Email sent',
    });

    const tool = createHimalayaTool();

    await tool.execute({
      args: {
        to: ['to@example.com'],
        cc: ['cc@example.com'],
        bcc: ['bcc@example.com'],
        subject: 'Test',
        body: 'Body',
      },
      context: {} as any,
    });

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: ['to@example.com'],
      cc: ['cc@example.com'],
      bcc: ['bcc@example.com'],
      subject: 'Test',
      body: 'Body',
    });
  });

  it('should handle account parameter', async () => {
    const mockSendEmail = vi.mocked(sendEmail);
    mockSendEmail.mockResolvedValue({
      success: true,
      message: 'Email sent',
    });

    const tool = createHimalayaTool();

    await tool.execute({
      args: {
        to: ['test@example.com'],
        subject: 'Test',
        body: 'Body',
        account: 'work',
      },
      context: {} as any,
    });

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
      account: 'work',
    });
  });
});
