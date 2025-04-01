import express, { type Express, Request, Response } from "express";
import type { Server } from "http";
import http from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertClientSchema, 
  insertCaseSchema, 
  insertCaseUpdateSchema, 
  insertDeadlineSchema, 
  insertDocumentSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Health check
  router.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Client routes
  router.get("/clients", async (_req: Request, res: Response) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  router.get("/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  router.post("/clients", async (req: Request, res: Response) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  router.put("/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, validatedData);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  router.delete("/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);
      
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Case routes
  router.get("/cases", async (_req: Request, res: Response) => {
    try {
      const cases = await storage.getCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  router.get("/cases/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const legalCase = await storage.getCase(id);
      
      if (!legalCase) {
        return res.status(404).json({ message: "Case not found" });
      }
      
      res.json(legalCase);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  router.get("/clients/:clientId/cases", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const cases = await storage.getCasesByClient(clientId);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases for client" });
    }
  });

  router.post("/cases", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const legalCase = await storage.createCase(validatedData);
      res.status(201).json(legalCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid case data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create case" });
    }
  });

  router.put("/cases/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCaseSchema.partial().parse(req.body);
      const legalCase = await storage.updateCase(id, validatedData);
      
      if (!legalCase) {
        return res.status(404).json({ message: "Case not found" });
      }
      
      res.json(legalCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid case data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update case" });
    }
  });

  router.delete("/cases/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCase(id);
      
      if (!success) {
        return res.status(404).json({ message: "Case not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete case" });
    }
  });

  // Case updates routes
  router.get("/cases/:caseId/updates", async (req: Request, res: Response) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const updates = await storage.getCaseUpdates(caseId);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case updates" });
    }
  });

  router.post("/cases/:caseId/updates", async (req: Request, res: Response) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const validatedData = insertCaseUpdateSchema.parse({
        ...req.body,
        caseId
      });
      
      const update = await storage.createCaseUpdate(validatedData);
      res.status(201).json(update);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create case update" });
    }
  });

  // Deadline routes
  router.get("/deadlines", async (_req: Request, res: Response) => {
    try {
      const deadlines = await storage.getDeadlines();
      res.json(deadlines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deadlines" });
    }
  });

  router.get("/deadlines/upcoming/:days", async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.params.days) || 7;
      const deadlines = await storage.getUpcomingDeadlines(days);
      res.json(deadlines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming deadlines" });
    }
  });

  router.get("/cases/:caseId/deadlines", async (req: Request, res: Response) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const deadlines = await storage.getDeadlinesByCaseId(caseId);
      res.json(deadlines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deadlines for case" });
    }
  });

  router.post("/deadlines", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDeadlineSchema.parse(req.body);
      const deadline = await storage.createDeadline(validatedData);
      res.status(201).json(deadline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deadline data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create deadline" });
    }
  });

  router.put("/deadlines/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDeadlineSchema.partial().parse(req.body);
      const deadline = await storage.updateDeadline(id, validatedData);
      
      if (!deadline) {
        return res.status(404).json({ message: "Deadline not found" });
      }
      
      res.json(deadline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deadline data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update deadline" });
    }
  });

  router.delete("/deadlines/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDeadline(id);
      
      if (!success) {
        return res.status(404).json({ message: "Deadline not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deadline" });
    }
  });

  // Document routes
  router.get("/documents", async (_req: Request, res: Response) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  router.get("/cases/:caseId/documents", async (req: Request, res: Response) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const documents = await storage.getDocumentsByCaseId(caseId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents for case" });
    }
  });

  router.post("/documents", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  router.put("/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDocumentSchema.partial().parse(req.body);
      const document = await storage.updateDocument(id, validatedData);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  router.delete("/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  app.use("/api", router);

  // Create an HTTP server without starting it
  const httpServer = http.createServer(app);
  return httpServer;
}
