import { Router, type Express } from "express";
import { db } from "./db";
import { units, users, leads, students, payments, timelineLogs, systemConfig } from "../shared/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Router {
  const router = Router();

  router.get("/api/units", async (req, res) => {
    try {
      const allUnits = await db.select().from(units);
      res.json(allUnits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch units" });
    }
  });

  router.get("/api/users", async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  router.get("/api/leads", async (req, res) => {
    try {
      const unitId = req.query.unitId as string | undefined;
      if (unitId) {
        const filteredLeads = await db.select().from(leads).where(eq(leads.unitId, parseInt(unitId)));
        return res.json(filteredLeads);
      }
      const allLeads = await db.select().from(leads);
      res.json(allLeads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  router.post("/api/leads", async (req, res) => {
    try {
      const [newLead] = await db.insert(leads).values(req.body).returning();
      res.json(newLead);
    } catch (error) {
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  router.put("/api/leads/:id", async (req, res) => {
    try {
      const [updatedLead] = await db.update(leads).set(req.body).where(eq(leads.id, parseInt(req.params.id))).returning();
      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  router.delete("/api/leads/:id", async (req, res) => {
    try {
      await db.delete(leads).where(eq(leads.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  router.get("/api/students", async (req, res) => {
    try {
      const unitId = req.query.unitId as string | undefined;
      if (unitId) {
        const filteredStudents = await db.query.students.findMany({
          where: eq(students.unitId, parseInt(unitId)),
          with: { timeline: true },
        });
        return res.json(filteredStudents);
      }
      const allStudents = await db.query.students.findMany({
        with: { timeline: true },
      });
      res.json(allStudents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  router.post("/api/students", async (req, res) => {
    try {
      const [newStudent] = await db.insert(students).values(req.body).returning();
      res.json(newStudent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create student" });
    }
  });

  router.delete("/api/students/:id", async (req, res) => {
    try {
      await db.delete(timelineLogs).where(eq(timelineLogs.studentId, parseInt(req.params.id)));
      await db.delete(students).where(eq(students.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  router.get("/api/payments", async (req, res) => {
    try {
      const unitId = req.query.unitId as string | undefined;
      if (unitId) {
        const filteredPayments = await db.select().from(payments).where(eq(payments.unitId, parseInt(unitId)));
        return res.json(filteredPayments);
      }
      const allPayments = await db.select().from(payments);
      res.json(allPayments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  router.get("/api/config", async (req, res) => {
    try {
      const [config] = await db.select().from(systemConfig);
      if (!config) {
        return res.json({
          whatsapp: { provider: 'gateway', baseUrl: '', apiKey: '', phoneNumberId: '' },
          gemini: { apiKey: '' },
          notificationEmail: ''
        });
      }
      res.json({
        whatsapp: {
          provider: config.whatsappProvider,
          baseUrl: config.whatsappBaseUrl,
          apiKey: config.whatsappApiKey,
          phoneNumberId: config.whatsappPhoneNumberId,
        },
        gemini: { apiKey: config.geminiApiKey },
        notificationEmail: config.notificationEmail,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch config" });
    }
  });

  router.post("/api/config", async (req, res) => {
    try {
      const { whatsapp, gemini, notificationEmail } = req.body;
      const configData = {
        whatsappProvider: whatsapp?.provider,
        whatsappBaseUrl: whatsapp?.baseUrl,
        whatsappApiKey: whatsapp?.apiKey,
        whatsappPhoneNumberId: whatsapp?.phoneNumberId,
        geminiApiKey: gemini?.apiKey,
        notificationEmail,
      };
      
      const existing = await db.select().from(systemConfig);
      if (existing.length > 0) {
        const [updated] = await db.update(systemConfig).set(configData).where(eq(systemConfig.id, existing[0].id)).returning();
        return res.json(updated);
      }
      const [created] = await db.insert(systemConfig).values(configData).returning();
      res.json(created);
    } catch (error) {
      res.status(500).json({ error: "Failed to save config" });
    }
  });

  app.use(router);
  return router;
}
