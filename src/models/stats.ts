export class Stats {
    personId: string;
    season:   string;
    compId:   string;
    teamId:   string;
    games:    number;
    minutes:  number;
    goals:    number;
    assists:  number;
  
    constructor(personId: string, name: string, compId: string, teamId: string, games: number, minutes: number, goals: number, assists: number) {
      this.personId = personId;
      this.season   = name;
      this.compId   = compId;
      this.teamId   = teamId;
      this.games    = games;
      this.minutes  = minutes;
      this.goals    = goals;
      this.assists  = assists;
    }
  }