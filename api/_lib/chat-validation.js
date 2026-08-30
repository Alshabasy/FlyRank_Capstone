import { z } from 'zod'

export const MAX_USER_MESSAGE_LENGTH = 1500
export const MAX_ASSISTANT_MESSAGE_LENGTH = 8000
export const MAX_TOOL_CONTENT_LENGTH = 6000
export const MAX_MESSAGES_IN_CONTEXT = 20
export const MAX_PAGE_CONTEXT_LENGTH = 400

const TextPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().max(MAX_ASSISTANT_MESSAGE_LENGTH, { message: 'text part too long' }),
})

const ReasoningPartSchema = z.object({
  type: z.literal('reasoning'),
  text: z.string().max(MAX_ASSISTANT_MESSAGE_LENGTH).optional(),
  details: z.unknown().optional(),
})

const ToolInvocationPartSchema = z.object({
  type: z.enum(['tool-invocation', 'tool-call']),
  toolName: z.string().max(64),
  toolCallId: z.string().max(128),
  args: z
    .record(z.unknown())
    .optional()
    .transform((v) => {
      const serialized = typeof v === 'string' ? v : JSON.stringify(v ?? {})
      if (serialized.length > MAX_TOOL_CONTENT_LENGTH) {
        throw new Error('tool args too large')
      }
      return v
    }),
})

const ToolResultPartSchema = z.object({
  type: z.enum(['tool-result', 'searchMovies-result']),
  toolName: z.string().max(64).optional(),
  toolCallId: z.string().max(128).optional(),
  result: z
    .unknown()
    .transform((v) => {
      const serialized = typeof v === 'string' ? v : JSON.stringify(v ?? '')
      if (serialized.length > MAX_TOOL_CONTENT_LENGTH) {
        throw new Error('tool result too large')
      }
      return v
    }),
  isError: z.boolean().optional(),
  content: z.string().max(MAX_TOOL_CONTENT_LENGTH).optional(),
})

const MessagePartSchema = z.union([
  TextPartSchema,
  ReasoningPartSchema,
  ToolInvocationPartSchema,
  ToolResultPartSchema,
])

const ChatMessageSchema = z.object({
  id: z.string().max(128).optional(),
  role: z.enum(['user', 'assistant', 'system', 'tool', 'data']),
  content: z.string().max(MAX_ASSISTANT_MESSAGE_LENGTH).optional(),
  parts: z
    .array(MessagePartSchema)
    .max(24, { message: 'too many parts per message' })
    .optional(),
  createdAt: z.union([z.number(), z.string()]).optional(),
})

export const ChatRequestSchema = z.object({
  id: z.string().max(128).optional(),
  trigger: z.string().max(32).optional(),
  messageId: z.string().max(128).optional(),
  pageContext: z.string().max(MAX_PAGE_CONTEXT_LENGTH).optional(),
  sabotage: z.string().max(32).optional(),
  messages: z
    .array(ChatMessageSchema)
    .min(1, { message: 'at least one message is required' })
    .max(MAX_MESSAGES_IN_CONTEXT, { message: 'too many messages' }),
})

export function validateUserMessageLengths(messages) {
  for (const msg of messages) {
    if (msg.role !== 'user') continue
    if (typeof msg.content === 'string' && msg.content.length > MAX_USER_MESSAGE_LENGTH) {
      return false
    }
    if (Array.isArray(msg.parts)) {
      for (const part of msg.parts) {
        if (part.type === 'text' && part.text.length > MAX_USER_MESSAGE_LENGTH) {
          return false
        }
      }
    }
  }
  return true
}
