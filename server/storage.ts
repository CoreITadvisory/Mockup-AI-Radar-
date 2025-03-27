import { AITool, InsertAITool, Status, RiskLevel } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;

  // AI Tool methods
  getAITools(filters?: Record<string, string>): Promise<AITool[]>;
  getAITool(id: number): Promise<AITool | undefined>;
  createAITool(tool: InsertAITool): Promise<AITool>;
  updateToolStatus(id: number, status: Status): Promise<AITool | undefined>;
  getToolStats(): Promise<{
    newTools: number;
    highRiskTools: number;
    pendingReview: number;
    approvedTools: number;
  }>;
  getRiskAssessment(period: string): Promise<any>;
  
  // Settings methods
  getSettings(): Promise<any>;
  updateSettings(settings: any): Promise<any>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private aiTools: Map<number, AITool>;
  private settings: any;
  userCurrentId: number;
  toolCurrentId: number;

  constructor() {
    this.users = new Map();
    this.aiTools = new Map();
    this.userCurrentId = 1;
    this.toolCurrentId = 1;
    
    // Initialize default settings
    this.settings = {
      sources: {
        github: true,
        producthunt: true,
        twitter: true,
        reddit: true,
      },
      api: {
        openaiApiKey: process.env.OPENAI_API_KEY || "",
        updateFrequency: "daily",
      },
      notifications: {
        emailNotifications: false,
        emailAddress: "",
        notifyOnHighRisk: true,
        notifyOnMediumRisk: false,
        notifyOnLowRisk: false,
      },
    };
  }

  // User methods
  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: any): Promise<any> {
    const id = this.userCurrentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // AI Tool methods
  async getAITools(filters: Record<string, string> = {}): Promise<AITool[]> {
    let tools = Array.from(this.aiTools.values());
    
    // Apply filters
    if (filters.riskLevel) {
      tools = tools.filter(tool => tool.riskLevel === filters.riskLevel);
    }
    
    if (filters.category) {
      tools = tools.filter(tool => tool.category === filters.category);
    }
    
    if (filters.source) {
      tools = tools.filter(tool => tool.source === filters.source);
    }
    
    if (filters.status) {
      tools = tools.filter(tool => tool.status === filters.status);
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date);
      tools = tools.filter(tool => {
        const toolDate = new Date(tool.discoveredAt);
        return (
          toolDate.getFullYear() === filterDate.getFullYear() &&
          toolDate.getMonth() === filterDate.getMonth() &&
          toolDate.getDate() === filterDate.getDate()
        );
      });
    }
    
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      tools = tools.filter(tool => {
        const toolDate = new Date(tool.discoveredAt);
        return toolDate >= startDate && toolDate <= endDate;
      });
    }
    
    // Sort by discovery date (newest first)
    return tools.sort((a, b) => 
      new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime()
    );
  }

  async getAITool(id: number): Promise<AITool | undefined> {
    return this.aiTools.get(id);
  }

  async createAITool(tool: InsertAITool): Promise<AITool> {
    const id = this.toolCurrentId++;
    const newTool: AITool = {
      ...tool,
      id,
      discoveredAt: new Date(),
    };
    this.aiTools.set(id, newTool);
    return newTool;
  }

  async updateToolStatus(id: number, status: Status): Promise<AITool | undefined> {
    const tool = this.aiTools.get(id);
    
    if (!tool) {
      return undefined;
    }
    
    const updatedTool = { ...tool, status };
    this.aiTools.set(id, updatedTool);
    return updatedTool;
  }

  async getToolStats(): Promise<{
    newTools: number;
    highRiskTools: number;
    pendingReview: number;
    approvedTools: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tools = Array.from(this.aiTools.values());
    
    // Count tools discovered today
    const newTools = tools.filter(tool => {
      const discoveredDate = new Date(tool.discoveredAt);
      discoveredDate.setHours(0, 0, 0, 0);
      return discoveredDate.getTime() === today.getTime();
    }).length;
    
    // Count high risk tools
    const highRiskTools = tools.filter(tool => tool.riskLevel === RiskLevel.HIGH).length;
    
    // Count pending review tools
    const pendingReview = tools.filter(tool => tool.status === Status.PENDING).length;
    
    // Count approved tools
    const approvedTools = tools.filter(tool => tool.status === Status.APPROVED).length;
    
    return {
      newTools,
      highRiskTools,
      pendingReview,
      approvedTools,
    };
  }

  async getRiskAssessment(period: string): Promise<any> {
    const tools = Array.from(this.aiTools.values());
    
    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    if (period === "week") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(endDate.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    // Filter tools within the period
    const filteredTools = tools.filter(tool => {
      const toolDate = new Date(tool.discoveredAt);
      return toolDate >= startDate && toolDate <= endDate;
    });
    
    // Count tools by risk level
    const highRisk = filteredTools.filter(tool => tool.riskLevel === RiskLevel.HIGH).length;
    const mediumRisk = filteredTools.filter(tool => tool.riskLevel === RiskLevel.MEDIUM).length;
    const lowRisk = filteredTools.filter(tool => tool.riskLevel === RiskLevel.LOW).length;
    
    // Calculate risk by category
    const categories = ["text", "image", "voice", "coding", "data", "other"];
    const categoryData = categories.map(category => {
      const categoryTools = filteredTools.filter(tool => tool.category === category);
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        high: categoryTools.filter(tool => tool.riskLevel === RiskLevel.HIGH).length,
        medium: categoryTools.filter(tool => tool.riskLevel === RiskLevel.MEDIUM).length,
        low: categoryTools.filter(tool => tool.riskLevel === RiskLevel.LOW).length,
      };
    });
    
    // Extract and count common security risks
    const securityRisksMap = new Map<string, {
      count: number;
      severity: string;
      description: string;
    }>();
    
    filteredTools.forEach(tool => {
      const risks = tool.securityAssessment as string[];
      risks.forEach(risk => {
        // Simplified logic - in a real app, would use more sophisticated analysis
        const key = risk.trim().toLowerCase().slice(0, 40);
        const severity = tool.riskLevel; // Associating with the tool's risk level
        
        if (securityRisksMap.has(key)) {
          securityRisksMap.get(key)!.count++;
        } else {
          securityRisksMap.set(key, {
            count: 1,
            severity,
            description: risk,
          });
        }
      });
    });
    
    // Sort risks by count and take top 5
    const commonRisks = Array.from(securityRisksMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1, 25) + "...",
        severity: value.severity,
        frequency: value.count,
        percentage: (value.count / filteredTools.length) * 100,
        description: value.description,
      }));
    
    return {
      highRisk,
      mediumRisk,
      lowRisk,
      categories: categoryData,
      commonRisks,
      period,
      total: filteredTools.length,
    };
  }

  // Settings methods
  async getSettings(): Promise<any> {
    return this.settings;
  }

  async updateSettings(settings: any): Promise<any> {
    this.settings = {
      ...this.settings,
      ...settings,
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
