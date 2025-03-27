import { storage } from "../storage";
import { analyzeToolSecurity } from "./tool-analyzer";
import { Category, Source, InsertAITool } from "@shared/schema";

// This function will be called on a schedule to collect new AI tool data
export async function collectData(): Promise<void> {
  try {
    const settings = await storage.getSettings();
    const enabledSources = Object.entries(settings?.sources || {})
      .filter(([_, enabled]) => enabled)
      .map(([source]) => source);
    
    if (enabledSources.length === 0) {
      console.log("No sources enabled for data collection");
      return;
    }
    
    console.log(`Collecting data from sources: ${enabledSources.join(", ")}`);
    
    // For demo purposes, we'll generate some sample tools
    // In a real implementation, this would make API calls to various sources
    const newTools = generateSampleTools(enabledSources);
    
    // Process each tool
    for (const tool of newTools) {
      try {
        // Analyze the tool for security risks
        const securityAnalysis = await analyzeToolSecurity(tool);
        
        // Create the tool with security assessment
        const newTool: InsertAITool = {
          ...tool,
          riskLevel: securityAnalysis.riskLevel,
          securityAssessment: securityAnalysis.securityAssessment,
          status: "pending", // All new tools start as pending review
        };
        
        await storage.createAITool(newTool);
        console.log(`Added new tool: ${tool.name}`);
      } catch (error) {
        console.error(`Error processing tool ${tool.name}:`, error);
      }
    }
    
    console.log(`Data collection complete. Added ${newTools.length} new tools.`);
  } catch (error) {
    console.error("Error in data collection process:", error);
    throw error;
  }
}

// Helper function to generate sample tools for demonstration
function generateSampleTools(enabledSources: string[]): Omit<InsertAITool, "riskLevel" | "securityAssessment" | "status">[] {
  const sampleTools = [
    {
      name: "DeepWrite AI",
      description: "Advanced text generation tool with document editing capabilities.",
      provider: "DeepWrite Labs Inc.",
      category: Category.TEXT,
      accessType: "Web-based, API",
      source: Source.GITHUB,
      sourceUrl: "https://github.com/deepwritelabs/deepwrite",
      websiteUrl: "https://deepwrite.ai",
    },
    {
      name: "PixelMind",
      description: "Image generation platform with style transfer capabilities.",
      provider: "PixelMind AI",
      category: Category.IMAGE,
      accessType: "Web-based, Mobile App",
      source: Source.PRODUCT_HUNT,
      sourceUrl: "https://www.producthunt.com/posts/pixelmind",
      websiteUrl: "https://pixelmind.ai",
    },
    {
      name: "CodeHelper Pro",
      description: "Coding assistant with IDE integrations and code completion.",
      provider: "DevTools Ltd.",
      category: Category.CODING,
      accessType: "VSCode Extension, Offline",
      source: Source.GITHUB,
      sourceUrl: "https://github.com/devtoolsltd/codehelper",
      websiteUrl: "https://codehelper.dev",
    },
    {
      name: "VoiceCraft",
      description: "Voice synthesis and cloning with emotion control.",
      provider: "Audio Innovations",
      category: Category.VOICE,
      accessType: "Cloud API, SDK",
      source: Source.TWITTER,
      sourceUrl: "https://twitter.com/VoiceCraftAI",
      websiteUrl: "https://voicecraft.ai",
    },
    {
      name: "DataSense",
      description: "Data analysis and visualization with automated insights.",
      provider: "Analytics Pro",
      category: Category.DATA,
      accessType: "Web Platform, API",
      source: Source.REDDIT,
      sourceUrl: "https://reddit.com/r/datascience/comments/datasense",
      websiteUrl: "https://datasense.io",
    },
    {
      name: "ImageGenius",
      description: "AI-powered image editing with advanced object removal.",
      provider: "CreativeTech",
      category: Category.IMAGE,
      accessType: "Desktop App, Cloud",
      source: Source.PRODUCT_HUNT,
      sourceUrl: "https://www.producthunt.com/posts/imagegenius",
      websiteUrl: "https://imagegenius.app",
    },
    {
      name: "TextWizard",
      description: "Content optimization and SEO enhancement tool.",
      provider: "SEO Masters",
      category: Category.TEXT,
      accessType: "Web App, Browser Extension",
      source: Source.TWITTER,
      sourceUrl: "https://twitter.com/TextWizardApp",
      websiteUrl: "https://textwizard.app",
    },
    {
      name: "CodeReviewer",
      description: "Automated code review and vulnerability scanning.",
      provider: "SecureCode Inc.",
      category: Category.CODING,
      accessType: "CI/CD Integration, GitHub App",
      source: Source.GITHUB,
      sourceUrl: "https://github.com/securecode/codereviewer",
      websiteUrl: "https://codereviewer.dev",
    },
    {
      name: "VoiceClone",
      description: "Real-time voice transformation for calls and meetings.",
      provider: "AudioLabs",
      category: Category.VOICE,
      accessType: "Desktop App, Mobile",
      source: Source.REDDIT,
      sourceUrl: "https://reddit.com/r/MachineLearning/comments/voiceclone",
      websiteUrl: "https://voiceclone.app",
    },
    {
      name: "DataMiner",
      description: "Automated data extraction and pattern recognition.",
      provider: "Insight Analytics",
      category: Category.DATA,
      accessType: "API, Python Library",
      source: Source.GITHUB,
      sourceUrl: "https://github.com/insightanalytics/dataminer",
      websiteUrl: "https://dataminer.tech",
    },
    {
      name: "AIAssistant",
      description: "Personal AI assistant with calendar management and email drafting.",
      provider: "ProductivityAI",
      category: Category.TEXT,
      accessType: "Web-based, Mobile App",
      source: Source.PRODUCT_HUNT,
      sourceUrl: "https://www.producthunt.com/posts/aiassistant",
      websiteUrl: "https://aiassistant.app",
    },
    {
      name: "PromptPro",
      description: "Advanced prompt engineering and management platform.",
      provider: "PromptWorks",
      category: Category.TEXT,
      accessType: "Web Interface, API",
      source: Source.TWITTER,
      sourceUrl: "https://twitter.com/PromptProAI",
      websiteUrl: "https://promptpro.ai",
    }
  ];
  
  // Filter tools by enabled sources
  return sampleTools.filter(tool => 
    enabledSources.includes(tool.source)
  );
}
