import type { AgentTool, PluginApi } from './plugin-types.js';
import { EmailSendParamsSchema, type EmailSendParams } from './types.js';
import { sendEmail } from './email.js';

/**
 * Create the himalaya email tool for OpenClaw
 */
export function createHimalayaTool(): AgentTool {
  return {
    name: 'email_send',
    description: 'Send an email using himalaya CLI. Supports QQ Mail, Gmail, Outlook and other IMAP/SMTP providers.',
    parameters: EmailSendParamsSchema,
    execute: async (input) => {
      const params = input.args as EmailSendParams;

      // Validate required parameters
      if (!params.to || params.to.length === 0) {
        return {
          type: 'error',
          error: {
            message: 'At least one recipient (to) is required',
            code: 'MISSING_RECIPIENTS',
          },
        };
      }

      if (!params.subject) {
        return {
          type: 'error',
          error: {
            message: 'Email subject is required',
            code: 'MISSING_SUBJECT',
          },
        };
      }

      if (!params.body) {
        return {
          type: 'error',
          error: {
            message: 'Email body is required',
            code: 'MISSING_BODY',
          },
        };
      }

      // Send email
      const result = await sendEmail(params);

      if (result.success) {
        return {
          type: 'success',
          text: result.message,
        };
      } else {
        return {
          type: 'error',
          error: {
            message: result.error,
            code: result.code,
          },
        };
      }
    },
  };
}

/**
 * Register the himalaya skill with OpenClaw
 */
export default function registerHimalayaSkill(api: PluginApi): void {
  const tool = createHimalayaTool();
  api.registerTool(tool);
}

/**
 * Export for direct usage
 */
export { sendEmail, type EmailSendParams, type ToolResult };
