"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatController = exports.AIChatController = void 0;
const aiChat_service_1 = require("./aiChat.service");
const errors_1 = require("../../utils/errors");
const zod_1 = require("zod");
// Validation schema
const chatMessageSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, 'Message is required'),
    conversationId: zod_1.z.string().optional().nullable(),
});
class AIChatController {
    constructor() {
        /**
         * POST /api/v1/ai-chat/message
         */
        this.sendMessage = (0, errors_1.catchAsync)(async (req, res) => {
            // Validate request body
            const validation = chatMessageSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    error: validation.error.issues.map((e) => e.message).join(', '),
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
            const result = await aiChat_service_1.aiChatService.sendMessage({ message, conversationId: conversationId ?? undefined }, token);
            res.json(result);
        });
        /**
         * DELETE /api/v1/ai-chat/clear/:conversationId
         */
        this.clearConversation = (0, errors_1.catchAsync)(async (req, res) => {
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
            const result = await aiChat_service_1.aiChatService.clearConversation(conversationId, token);
            res.json(result);
        });
        /**
         * GET /api/v1/ai-chat/health
         */
        this.checkHealth = (0, errors_1.catchAsync)(async (_req, res) => {
            const health = await aiChat_service_1.aiChatService.checkHealth();
            res.json(health);
        });
    }
}
exports.AIChatController = AIChatController;
exports.aiChatController = new AIChatController();
