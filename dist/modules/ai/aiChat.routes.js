"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiChat_controller_1 = require("./aiChat.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const aiChatController = new aiChat_controller_1.AIChatController();
// Simple test route
router.get('/test', (_req, res) => {
    res.json({ message: 'AI Chat routes are working!' });
});
// Health check (no auth required)
router.get('/health', aiChatController.checkHealth);
// Protected routes
router.post('/message', auth_middleware_1.authenticate, aiChatController.sendMessage);
router.delete('/clear/:conversationId', auth_middleware_1.authenticate, aiChatController.clearConversation);
exports.default = router;
