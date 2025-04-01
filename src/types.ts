export enum RiskLevel {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum Category {
  TEXT = "text",
  IMAGE = "image",
  VOICE = "voice",
  CODING = "coding",
  DATA = "data",
  OTHER = "other",
}

export enum Source {
  GITHUB = "github",
  PRODUCT_HUNT = "producthunt",
  TWITTER = "twitter",
  REDDIT = "reddit",
}

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  BLOCKED = "blocked",
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: Category;
  accessType: string;
  source: Source;
  sourceUrl: string;
  websiteUrl: string;
  riskLevel: RiskLevel;
  status: Status;
  createdAt: string;
  updatedAt: string;
} 