import { AITool, RiskLevel, Category, RiskLevelType } from "@shared/schema";
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
  riskLevel: RiskLevelType;
  securityAssessment: string[];
}> {
  try {
    const prompt = `
      Please perform a comprehensive security risk assessment for this AI tool from an enterprise security perspective:
      
      ## Tool Information
      - Name: ${tool.name}
      - Description: ${tool.description}
      - Provider: ${tool.provider}
      - Category: ${tool.category}
      - Access Type: ${tool.accessType}
      - Source: ${tool.source}
      - Website: ${tool.websiteUrl || "Not provided"}
      
      ## Assessment Requirements
      1. Assign a risk level using only one of these values: "high", "medium", or "low"
      2. Identify 3-5 specific security or privacy risks this tool might introduce in an enterprise setting
      
      ## Risk Level Guidelines
      - High Risk: Tools that access, process, or store sensitive data; have broad access permissions; or lack transparent data policies
      - Medium Risk: Tools with limited data access or strong privacy controls but some enterprise integration concerns
      - Low Risk: Tools with clear data policies, offline processing capabilities, or enterprise-grade security features
      
      ## Security Assessment Guidelines
      - Be specific about potential data exfiltration vectors
      - Consider issues with data processing transparency
      - Evaluate access control mechanisms
      - Assess regulatory compliance implications
      - Identify potential for misuse
      - Consider API security if applicable
      
      Format your response strictly as a JSON object with this structure:
      {
        "riskLevel": "high|medium|low",
        "securityAssessment": ["Detailed security risk 1", "Detailed security risk 2", "Detailed security risk 3", ...]
      }
    `;

    const result = await analyzeWithOpenAI(prompt);
    
    // Fallback in case OpenAI analysis fails
    if (!result || !result.riskLevel || !result.securityAssessment) {
      return generateFallbackAnalysis(tool);
    }
    
    // Ensure risk level is one of the allowed values
    const riskLevel = result.riskLevel.toLowerCase();
    let validRiskLevel: RiskLevelType = RiskLevel.MEDIUM;
    
    if (riskLevel === RiskLevel.HIGH) {
      validRiskLevel = RiskLevel.HIGH;
    } else if (riskLevel === RiskLevel.MEDIUM) {
      validRiskLevel = RiskLevel.MEDIUM;
    } else if (riskLevel === RiskLevel.LOW) {
      validRiskLevel = RiskLevel.LOW;
    }
    
    return {
      riskLevel: validRiskLevel,
      securityAssessment: result.securityAssessment,
    };
  } catch (error) {
    console.error("Error analyzing tool security:", error);
    return generateFallbackAnalysis(tool);
  }
}

// Generate a basic analysis if OpenAI fails
function generateFallbackAnalysis(tool: any): {
  riskLevel: RiskLevelType;
  securityAssessment: string[];
} {
  // Determine risk level based on category and access type
  let riskLevel: RiskLevelType = RiskLevel.MEDIUM;
  
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
