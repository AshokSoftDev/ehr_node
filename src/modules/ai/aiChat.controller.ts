import { Response } from 'express';
import { AuthRequest } from '../../types/express';
import { aiChatService } from './aiChat.service';
import { catchAsync } from '../../utils/errors';
import { z } from 'zod';

// Validation schema
const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional().nullable(),
});

export class AIChatController {
  /**
   * POST /api/v1/ai-chat/message
   */
  sendMessage = catchAsync(async (req: AuthRequest, res: Response) => {
    // Validate request body
    const validation = chatMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.issues.map((e: z.ZodIssue) => e.message).join(', '),
      });
    }

    const { message, conversationId } = validation.data;

    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Send to AI service
    const result = await aiChatService.sendMessage(
      { message, conversationId: conversationId ?? undefined },
      token
    );

    res.json(result);
  });

  /**
   * DELETE /api/v1/ai-chat/clear/:conversationId
   */
  clearConversation = catchAsync(async (req: AuthRequest, res: Response) => {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required',
      });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const result = await aiChatService.clearConversation(conversationId, token);
    res.json(result);
  });

  /**
   * GET /api/v1/ai-chat/health
   */
  checkHealth = catchAsync(async (_req: AuthRequest, res: Response) => {
    const health = await aiChatService.checkHealth();
    res.json(health);
  });
}

export const aiChatController = new AIChatController();
