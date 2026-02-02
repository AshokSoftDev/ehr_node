import axios from 'axios';

// AI Server configuration
const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:3001';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  conversationId: string;
  timestamp: string;
}

class AIChatService {
  /**
   * Send a message to the AI assistant
   */
  async sendMessage(request: ChatRequest, token: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        `${AI_SERVER_URL}/api/v1/chat`,
        {
          message: request.message,
          conversationId: request.conversationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 seconds for AI responses
        }
      );
console.log(response.data);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(`AI Service Error: ${message}`);
      }
      throw new Error('AI Service Error: Unknown error');
    }
  }

  /**
   * Clear conversation history
   */
  async clearConversation(conversationId: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(
        `${AI_SERVER_URL}/api/v1/chat/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(`AI Service Error: ${message}`);
      }
      throw new Error('Failed to clear conversation');
    }
  }

  /**
   * Check AI service health
   */
  async checkHealth(): Promise<{ status: string; services: Record<string, string> }> {
    try {
      const response = await axios.get(`${AI_SERVER_URL}/api/v1/chat/health`, {
        timeout: 5000,
      });

      return response.data;
    } catch (error) {
      return {
        status: 'unavailable',
        services: { ai: 'disconnected' },
      };
    }
  }
}

export const aiChatService = new AIChatService();
