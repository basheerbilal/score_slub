/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, Team } from './types';

export interface SyncResult {
  matches: Match[];
  teams: Team[];
}

export async function fetchFootballData(provider: 'football-data' | 'api-football', token: string): Promise<SyncResult> {
  if (provider === 'football-data') {
    // Fetch from football-data.org with date range to capture both past completed matches and upcoming fixtures
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - 30); // 30 days ago
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 7); // 7 days ahead

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const targetUrl = `https://api.football-data.org/v4/matches?dateFrom=${formatDate(pastDate)}&dateTo=${formatDate(futureDate)}`;
    
    const response = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawMatches = data.matches || [];

    const teamsMap = new Map<number, Team>();
    const matches: Match[] = [];

    rawMatches.forEach((m: any) => {
      const homeId = m.homeTeam.id;
      const awayId = m.awayTeam.id;

      // Add home team
      if (!teamsMap.has(homeId)) {
        teamsMap.set(homeId, {
          id: homeId,
          name: m.homeTeam.name,
          logo_url: m.homeTeam.crest || '⚽',
          stadium: m.venue || 'Stadium',
          founded_year: 1900,
          coach: 'Unknown'
        });
      }

      // Add away team
      if (!teamsMap.has(awayId)) {
        teamsMap.set(awayId, {
          id: awayId,
          name: m.awayTeam.name,
          logo_url: m.awayTeam.crest || '⚽',
          stadium: m.venue || 'Stadium',
          founded_year: 1900,
          coach: 'Unknown'
        });
      }

      // Map status
      let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
      if (m.status === 'FINISHED') {
        status = 'completed';
      } else if (m.status === 'IN_PLAY' || m.status === 'PAUSED') {
        status = 'live';
      }

      matches.push({
        id: m.id,
        home_team_id: homeId,
        away_team_id: awayId,
        home_team_score: m.score.fullTime.home ?? 0,
        away_team_score: m.score.fullTime.away ?? 0,
        match_date: m.utcDate,
        status: status,
        stadium: m.venue || 'Stadium',
        competition: m.competition?.name || 'League'
      });
    });

    return {
      matches,
      teams: Array.from(teamsMap.values())
    };
  } else {
    // Fetch from API-Football through corsproxy.io to bypass browser CORS blocking
    const todayStr = new Date().toISOString().split('T')[0];
    const targetUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${todayStr}`;
    const response = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': token
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawFixtures = data.response || [];

    const teamsMap = new Map<number, Team>();
    const matches: Match[] = [];

    rawFixtures.forEach((f: any) => {
      const homeId = f.teams.home.id;
      const awayId = f.teams.away.id;

      // Add home team
      if (!teamsMap.has(homeId)) {
        teamsMap.set(homeId, {
          id: homeId,
          name: f.teams.home.name,
          logo_url: f.teams.home.logo || '⚽',
          stadium: f.fixture.venue?.name || 'Stadium',
          founded_year: 1900,
          coach: 'Unknown'
        });
      }

      // Add away team
      if (!teamsMap.has(awayId)) {
        teamsMap.set(awayId, {
          id: awayId,
          name: f.teams.away.name,
          logo_url: f.teams.away.logo || '⚽',
          stadium: f.fixture.venue?.name || 'Stadium',
          founded_year: 1900,
          coach: 'Unknown'
        });
      }

      // Map status
      let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
      const statusShort = f.fixture.status.short;
      if (['FT', 'AET', 'PEN'].includes(statusShort)) {
        status = 'completed';
      } else if (['1H', '2H', 'HT', 'ET', 'P'].includes(statusShort)) {
        status = 'live';
      }

      matches.push({
        id: f.fixture.id,
        home_team_id: homeId,
        away_team_id: awayId,
        home_team_score: f.goals.home ?? 0,
        away_team_score: f.goals.away ?? 0,
        match_date: f.fixture.date,
        status: status,
        stadium: f.fixture.venue?.name || 'Stadium',
        competition: f.league.name || 'League'
      });
    });

    return {
      matches,
      teams: Array.from(teamsMap.values())
    };
  }
}
