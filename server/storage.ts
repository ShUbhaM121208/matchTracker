import { users, type User, type InsertUser, type Match, type Competition } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUpcomingMatches(competitionCode?: string): Promise<Match[]>;
  getCompetitions(): Promise<Competition[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUpcomingMatches(competitionCode = 'PL'): Promise<Match[]> {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY || process.env.VITE_FOOTBALL_DATA_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('Football Data API key is required');
    }

    try {
      // Try multiple competitions to find upcoming matches
      const competitions = ['PL', 'CL', 'FL1', 'BL1', 'SA', 'PD', 'EC'];
      let allMatches: any[] = [];

      for (const comp of competitions) {
        try {
          const response = await fetch(
            `https://api.football-data.org/v4/competitions/${comp}/matches?status=SCHEDULED`,
            {
              headers: {
                'X-Auth-Token': apiKey,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.matches && data.matches.length > 0) {
              allMatches = allMatches.concat(data.matches);
              // Limit to first 20 matches to avoid overwhelming the UI
              if (allMatches.length >= 20) break;
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch matches for ${comp}:`, error);
          continue;
        }
      }

      // Sort matches by date
      allMatches.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
      
      return allMatches.slice(0, 20); // Return max 20 matches
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getCompetitions(): Promise<Competition[]> {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY || process.env.VITE_FOOTBALL_DATA_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('Football Data API key is required');
    }

    try {
      const response = await fetch(
        'https://api.football-data.org/v4/competitions',
        {
          headers: {
            'X-Auth-Token': apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.competitions || [];
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error;
    }
  }
}

export const storage = new MemStorage();
