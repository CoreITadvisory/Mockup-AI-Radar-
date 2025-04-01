import { AITool, Category, RiskLevel, Source, Status } from "@/types";

export const mockStats = {
  newTools: 15,
  highRiskTools: 8,
  pendingReview: 12,
  approvedTools: 45,
};

export const mockTools: AITool[] = [
  {
    id: "1",
    name: "ChatGPT",
    description: "Advanced language model for conversation and text generation",
    provider: "OpenAI",
    category: Category.TEXT,
    accessType: "API",
    source: Source.GITHUB,
    sourceUrl: "https://github.com/openai/gpt-3",
    websiteUrl: "https://chat.openai.com",
    riskLevel: RiskLevel.HIGH,
    status: Status.APPROVED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "DALL-E",
    description: "AI system that creates images from textual descriptions",
    provider: "OpenAI",
    category: Category.IMAGE,
    accessType: "API",
    source: Source.PRODUCT_HUNT,
    sourceUrl: "https://www.producthunt.com/posts/dall-e-2",
    websiteUrl: "https://labs.openai.com",
    riskLevel: RiskLevel.MEDIUM,
    status: Status.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 