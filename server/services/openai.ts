import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeWithOpenAI(prompt: string): Promise<any> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OpenAI API key provided, using mock analysis");
      return mockAnalysis(prompt);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert specialized in AI tool risk assessment for enterprise environments. Provide detailed, accurate security analyses in JSON format."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2 // Lower temperature for more consistent, analytical responses
    });

    // Ensure we have a valid response with content
    if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
      return JSON.parse(response.choices[0].message.content);
    }
    
    console.warn("OpenAI returned an empty or invalid response");
    return {};
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return mockAnalysis(prompt);
  }
}

// Generate mock analysis for development/fallback
function mockAnalysis(prompt: string): any {
  // Extract tool name from prompt
  const nameMatch = prompt.match(/Name: (.*?)(?:\n|$)/);
  const descMatch = prompt.match(/Description: (.*?)(?:\n|$)/);
  const categoryMatch = prompt.match(/Category: (.*?)(?:\n|$)/);
  
  const name = nameMatch ? nameMatch[1] : "Unknown Tool";
  const description = descMatch ? descMatch[1] : "";
  const category = categoryMatch ? categoryMatch[1].toLowerCase() : "";
  
  // Determine risk level based on category
  let riskLevel = "medium";
  if (category.includes("text") || category.includes("data")) {
    riskLevel = "high";
  } else if (category.includes("coding") && description.toLowerCase().includes("offline")) {
    riskLevel = "low";
  }
  
  // Generate risks based on tool type
  const securityRisks = [];
  
  if (category.includes("text")) {
    securityRisks.push(
      "May store user-submitted text content for model training without explicit consent.",
      "Lacks enterprise-grade data encryption for sensitive information.",
      "Terms of service allow content analysis which could compromise confidential data."
    );
  } else if (category.includes("image")) {
    securityRisks.push(
      "Generated images are stored on their servers for 30 days without option to delete.",
      "Uses uploaded images to improve model with limited opt-out capabilities.",
      "Lacks comprehensive content filtering which could lead to generation of inappropriate imagery."
    );
  } else if (category.includes("voice")) {
    securityRisks.push(
      "Voice samples may be retained indefinitely for service improvement.",
      "Lacks clear data residency policies for voice processing.",
      "Limited authentication options could lead to unauthorized voice cloning."
    );
  } else if (category.includes("coding")) {
    securityRisks.push(
      "May upload code snippets to cloud servers for processing despite offline claims.",
      "Limited transparency about how code samples influence future suggestions.",
      "Potential for leaking proprietary algorithms through context window."
    );
  } else if (category.includes("data")) {
    securityRisks.push(
      "Data processing occurs on remote servers with unclear jurisdictional protections.",
      "Lacks granular access controls for different data sensitivity levels.",
      "Aggregated insights may inadvertently expose confidential business intelligence."
    );
  } else {
    securityRisks.push(
      "Unclear data handling and retention policies.",
      "Limited enterprise security features like SSO or access controls.",
      "May share anonymized usage data with third parties."
    );
  }
  
  return {
    riskLevel,
    securityAssessment: securityRisks
  };
}
