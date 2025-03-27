import { AITool, RiskLevel, Category } from "@shared/schema";
import { analyzeWithOpenAI } from "./openai";

export async function analyzeToolSecurity(tool: {
  name: string;
  description: string;
  provider: string;
  category: string;
  accessType: string;
  source: string;
  sourceUrl: string;
  websiteUrl?: string;
}): Promise<{
  riskLevel: string;
  securityAssessment: string[];
}> {
  try {
    const prompt = `
      You are a cybersecurity expert specializing in AI tool security assessment for enterprise security teams.
      
      Please analyze the following AI tool:
      
      Name: ${tool.name}
      Description: ${tool.description}
      Provider: ${tool.provider}
      Category: ${tool.category}
      Access Type: ${tool.accessType}
      Website: ${tool.websiteUrl || "Not provided"}
      
      Based on the information provided:
      1. Determine the risk level (high, medium, or low) for enterprise use
      2. Identify potential security risks and privacy concerns (at least 3)
      
      Respond in JSON format with the following structure:
      {
        "riskLevel": "high/medium/low",
        "securityAssessment": ["risk 1", "risk 2", "risk 3", ...]
      }
      
      Each security risk should be a specific, detailed sentence about a potential security issue.
    `;

    const result = await analyzeWithOpenAI(prompt);
    
    // Fallback in case OpenAI analysis fails
    if (!result || !result.riskLevel || !result.securityAssessment) {
      return generateFallbackAnalysis(tool);
    }
    
    return {
      riskLevel: result.riskLevel,
      securityAssessment: result.securityAssessment,
    };
  } catch (error) {
    console.error("Error analyzing tool security:", error);
    return generateFallbackAnalysis(tool);
  }
}

// Generate a basic analysis if OpenAI fails
function generateFallbackAnalysis(tool: any): {
  riskLevel: string;
  securityAssessment: string[];
} {
  // Determine risk level based on category and access type
  let riskLevel = RiskLevel.MEDIUM;
  
  if (tool.category === Category.DATA || tool.category === Category.TEXT) {
    riskLevel = RiskLevel.HIGH;
  } else if (tool.category === Category.CODING && tool.accessType.includes("API")) {
    riskLevel = RiskLevel.HIGH;
  } else if (tool.category === Category.IMAGE) {
    riskLevel = RiskLevel.MEDIUM;
  } else if (tool.accessType.toLowerCase().includes("offline")) {
    riskLevel = RiskLevel.LOW;
  }
  
  // Generate generic risks based on category
  const securityAssessment = [
    `May process and store sensitive data for training purposes.`,
    `Limited transparency regarding data retention policies.`,
    `Potential for unauthorized access via API endpoints.`,
  ];
  
  if (tool.category === Category.TEXT) {
    securityAssessment.push(`Could exfiltrate sensitive information through text inputs.`);
  } else if (tool.category === Category.IMAGE) {
    securityAssessment.push(`May extract metadata from uploaded images including location data.`);
  } else if (tool.category === Category.VOICE) {
    securityAssessment.push(`Voice data could be stored and used for speaker identification.`);
  } else if (tool.category === Category.CODING) {
    securityAssessment.push(`Code inputs might be stored and analyzed, potentially exposing proprietary code.`);
  }
  
  return {
    riskLevel,
    securityAssessment,
  };
}
