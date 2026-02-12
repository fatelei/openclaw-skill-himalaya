import { Type } from '@sinclair/typebox';

/**
 * TypeBox schema for the email_send tool
 */
export const EmailSendParamsSchema = Type.Object({
  to: Type.Array(
    Type.String({
      description: 'Recipient email address',
      format: 'email',
    }),
    { description: 'List of recipient email addresses' }
  ),
  subject: Type.String({
    description: 'Email subject line',
    minLength: 1,
  }),
  body: Type.String({
    description: 'Email body content (plain text or HTML)',
  }),
  cc: Type.Optional(
    Type.Array(
      Type.String({ format: 'email' }),
      { description: 'CC recipients' }
    )
  ),
  bcc: Type.Optional(
    Type.Array(
      Type.String({ format: 'email' }),
      { description: 'BCC recipients' }
    )
  ),
  account: Type.Optional(
    Type.String({
      description: 'Himalaya account name (uses default if not specified)',
    })
  ),
});

export type EmailSendParams = {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  account?: string;
};

/**
 * Tool result types
 */
export interface ToolSuccessResult {
  success: true;
  message: string;
  data?: {
    recipients: string[];
    subject: string;
  };
}

export interface ToolErrorResult {
  success: false;
  error: string;
  code?: string;
}

export type ToolResult = ToolSuccessResult | ToolErrorResult;
