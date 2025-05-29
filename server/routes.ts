import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { matchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get upcoming matches
  app.get("/api/matches", async (req, res) => {
    try {
      const competitionCode = req.query.competition as string || 'PL';
      const matches = await storage.getUpcomingMatches(competitionCode);
      
      // Validate and format the response
      const validatedMatches = matches.map(match => {
        try {
          return matchSchema.parse(match);
        } catch (error) {
          console.warn('Invalid match data:', error);
          return null;
        }
      }).filter(Boolean);

      res.json({
        matches: validatedMatches,
        count: validatedMatches.length,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ 
        error: 'Failed to fetch matches',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get competitions
  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getCompetitions();
      res.json({
        competitions,
        count: competitions.length,
      });
    } catch (error) {
      console.error('Error fetching competitions:', error);
      res.status(500).json({ 
        error: 'Failed to fetch competitions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
