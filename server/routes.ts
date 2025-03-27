import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAIToolSchema } from "@shared/schema";
import { Status, RiskLevel } from "@shared/schema";
import { collectData } from "./services/data-collector";
import { analyzeToolSecurity } from "./services/tool-analyzer";
import cron from "node-cron";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up the server
  const httpServer = createServer(app);

  // Initialize tool collection
  initializeDataCollection();

  // API Routes
  app.get("/api/tools", async (req, res) => {
    try {
      const { riskLevel, category, source, date, tab } = req.query;
      const filters: Record<string, string> = {};

      if (riskLevel) filters.riskLevel = riskLevel as string;
      if (category) filters.category = category as string;
      if (source) filters.source = source as string;
      if (date) filters.date = date as string;

      // Handle tab filter
      if (tab === "high-risk") {
        filters.riskLevel = RiskLevel.HIGH;
      } else if (tab === "pending") {
        filters.status = Status.PENDING;
      } else if (tab === "approved") {
        filters.status = Status.APPROVED;
      } else if (tab === "blocked") {
        filters.status = Status.BLOCKED;
      }

      const tools = await storage.getAITools(filters);
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: `Failed to get tools: ${error.message}` });
    }
  });

  app.get("/api/tools/stats", async (req, res) => {
    try {
      const stats = await storage.getToolStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: `Failed to get tool stats: ${error.message}` });
    }
  });

  app.get("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tool = await storage.getAITool(id);
      
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      
      res.json(tool);
    } catch (error) {
      res.status(500).json({ message: `Failed to get tool: ${error.message}` });
    }
  });

  app.patch("/api/tools/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || (status !== Status.APPROVED && status !== Status.BLOCKED)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedTool = await storage.updateToolStatus(id, status);
      
      if (!updatedTool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      
      res.json(updatedTool);
    } catch (error) {
      res.status(500).json({ message: `Failed to update tool status: ${error.message}` });
    }
  });

  app.get("/api/risk-assessment", async (req, res) => {
    try {
      const period = req.query.period as string || "week";
      const riskData = await storage.getRiskAssessment(period);
      res.json(riskData);
    } catch (error) {
      res.status(500).json({ message: `Failed to get risk assessment: ${error.message}` });
    }
  });

  app.post("/api/export", async (req, res) => {
    try {
      const { startDate, endDate, options, format } = req.body;
      
      const tools = await storage.getAITools({
        startDate,
        endDate,
      });
      
      // Format the data according to the requested format
      if (format === "csv") {
        // Generate CSV
        let csv = "ID,Name,Description,Provider,Category,Access Type,Risk Level,Status,Discovered\n";
        
        tools.forEach(tool => {
          const row = [
            tool.id,
            `"${tool.name}"`,
            `"${tool.description}"`,
            `"${tool.provider}"`,
            tool.category,
            `"${tool.accessType}"`,
            tool.riskLevel,
            tool.status,
            new Date(tool.discoveredAt).toISOString()
          ];
          
          csv += row.join(",") + "\n";
        });
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=ai-tools-export.csv");
        return res.send(csv);
      } else if (format === "xlsx") {
        // For demo purposes, returning CSV instead of XLSX
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=ai-tools-export.csv");
        return res.send("XLSX export would go here in production");
      } else {
        // Default to PDF-like format (actually HTML for demo)
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Disposition", "attachment; filename=ai-tools-export.html");
        
        let html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>AI Tools Export</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background-color: #f2f2f2; }
              .high { color: #ef4444; }
              .medium { color: #f97316; }
              .low { color: #22c55e; }
            </style>
          </head>
          <body>
            <h1>AI Tools Security Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Risk Level</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Discovered</th>
                </tr>
              </thead>
              <tbody>
        `;
        
        tools.forEach(tool => {
          const discoveredDate = new Date(tool.discoveredAt).toLocaleDateString();
          html += `
            <tr>
              <td>${tool.name}</td>
              <td class="${tool.riskLevel}">${tool.riskLevel}</td>
              <td>${tool.provider}</td>
              <td>${tool.category}</td>
              <td>${tool.status}</td>
              <td>${discoveredDate}</td>
            </tr>
          `;
          
          if (options.includeRisks) {
            html += `
              <tr>
                <td colspan="6">
                  <strong>Security Assessment:</strong>
                  <ul>
                    ${(tool.securityAssessment as string[]).map(risk => `<li>${risk}</li>`).join('')}
                  </ul>
                </td>
              </tr>
            `;
          }
        });
        
        html += `
              </tbody>
            </table>
          </body>
          </html>
        `;
        
        return res.send(html);
      }
    } catch (error) {
      res.status(500).json({ message: `Failed to export data: ${error.message}` });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: `Failed to get settings: ${error.message}` });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const settings = req.body;
      const updatedSettings = await storage.updateSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: `Failed to update settings: ${error.message}` });
    }
  });

  return httpServer;
}

function initializeDataCollection() {
  // Initialize with some sample data
  seedInitialData();
  
  // Schedule regular data collection (daily at midnight)
  cron.schedule("0 0 * * *", async () => {
    try {
      await collectData();
    } catch (error) {
      console.error("Error in scheduled data collection:", error);
    }
  });
}

async function seedInitialData() {
  try {
    const existingTools = await storage.getAITools({});
    
    // Only seed if no tools exist
    if (existingTools.length === 0) {
      await collectData();
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}
