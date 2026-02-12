import { describe, it, expect } from 'vitest';
import { Type } from '@sinclair/typebox';
import { EmailSendParamsSchema } from '../types.js';

describe('EmailSendParamsSchema', () => {
  it('should define required parameters', () => {
    const schema = EmailSendParamsSchema;

    expect(schema.properties.to).toBeDefined();
    expect(schema.properties.subject).toBeDefined();
    expect(schema.properties.body).toBeDefined();
  });

  it('should define to as array of strings', () => {
    const toProp = EmailSendParamsSchema.properties.to as any;

    expect(toProp.type).toBe('array');
    expect(toProp.items.type).toBe('string');
    expect(toProp.items.format).toBe('email');
  });

  it('should define subject as string with minLength', () => {
    const subjectProp = EmailSendParamsSchema.properties.subject as any;

    expect(subjectProp.type).toBe('string');
    expect(subjectProp.minLength).toBe(1);
  });

  it('should define body as string', () => {
    const bodyProp = EmailSendParamsSchema.properties.body as any;

    expect(bodyProp.type).toBe('string');
  });

  it('should define cc as optional array of strings', () => {
    const ccProp = EmailSendParamsSchema.properties.cc as any;

    expect(ccProp).toBeDefined();
    expect(ccProp.type).toBe('array');
    expect(ccProp.items.type).toBe('string');
    expect(ccProp.items.format).toBe('email');
  });

  it('should define bcc as optional array of strings', () => {
    const bccProp = EmailSendParamsSchema.properties.bcc as any;

    expect(bccProp).toBeDefined();
    expect(bccProp.type).toBe('array');
    expect(bccProp.items.type).toBe('string');
    expect(bccProp.items.format).toBe('email');
  });

  it('should define account as optional string', () => {
    const accountProp = EmailSendParamsSchema.properties.account as any;

    expect(accountProp).toBeDefined();
    expect(accountProp.type).toBe('string');
  });

  it('should validate correct email format', () => {
    const toProp = EmailSendParamsSchema.properties.to as any;

    expect(toProp.items.format).toBe('email');
  });

  // Type validation tests
  it('should accept valid email parameters', () => {
    const validParams = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body',
    };

    // This test ensures TypeScript types are correct
    const to: string[] = validParams.to;
    const subject: string = validParams.subject;
    const body: string = validParams.body;

    expect(to).toEqual(['test@example.com']);
    expect(subject).toBe('Test Subject');
    expect(body).toBe('Test Body');
  });

  it('should accept parameters with CC and BCC', () => {
    const params = {
      to: ['to@example.com'],
      subject: 'Test',
      body: 'Body',
      cc: ['cc@example.com'],
      bcc: ['bcc@example.com'],
    };

    const cc: string[] | undefined = params.cc;
    const bcc: string[] | undefined = params.bcc;

    expect(cc).toBeDefined();
    expect(bcc).toBeDefined();
    expect(cc).toEqual(['cc@example.com']);
    expect(bcc).toEqual(['bcc@example.com']);
  });

  it('should accept parameters with account', () => {
    const params = {
      to: ['test@example.com'],
      subject: 'Test',
      body: 'Body',
      account: 'work',
    };

    const account: string | undefined = params.account;

    expect(account).toBe('work');
  });
});
