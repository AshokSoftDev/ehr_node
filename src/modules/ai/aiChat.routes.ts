import { Router, Request, Response } from 'express';
import { AIChatController } from './aiChat.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const aiChatController = new AIChatController();

// Simple test route
router.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'AI Chat routes are working!' });
});

// Health check (no auth required)
router.get('/health', aiChatController.checkHealth);

// Protected routes
router.post('/message', authenticate, aiChatController.sendMessage);
router.delete('/clear/:conversationId', authenticate, aiChatController.clearConversation);

export default router;
