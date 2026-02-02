"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatService = void 0;
const axios_1 = __importDefault(require("axios"));
// AI Server configuration
const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:3001';
class AIChatService {
    /**
     * Send a message to the AI assistant
     */
    async sendMessage(request, token) {
        try {
            const response = await axios_1.default.post(`${AI_SERVER_URL}/api/v1/chat`, {
                message: request.message,
                conversationId: request.conversationId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000, // 60 seconds for AI responses
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message;
                throw new Error(`AI Service Error: ${message}`);
            }
            throw new Error('AI Service Error: Unknown error');
        }
    }
    /**
     * Clear conversation history
     */
    async clearConversation(conversationId, token) {
        try {
            const response = await axios_1.default.delete(`${AI_SERVER_URL}/api/v1/chat/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message;
                throw new Error(`AI Service Error: ${message}`);
            }
            throw new Error('Failed to clear conversation');
        }
    }
    /**
     * Check AI service health
     */
    async checkHealth() {
        try {
            const response = await axios_1.default.get(`${AI_SERVER_URL}/api/v1/chat/health`, {
                timeout: 5000,
            });
            return response.data;
        }
        catch (error) {
            return {
                status: 'unavailable',
                services: { ai: 'disconnected' },
            };
        }
    }
}
exports.aiChatService = new AIChatService();
