export class tableOfStats {
    season:         string;
    age:            number;
    team:           string;
    country:        string;
    competition:    string;
    games:          number;
    minutes:        number;
    goals:          number;
    assists:        number;
    goalsPerNinety: number;
  
    constructor(season: string, age: number, team: string, country: string, competition: string, games: number, minutes: number, goals: number, assists: number, goalsPerNinety: number) {
      this.season         = season;
      this.age            = age;
      this.team           = team;
      this.country        = country;
      this.competition    = competition;
      this.games          = games;
      this.minutes        = minutes;
      this.goals          = goals;
      this.assists        = assists;
      this.goalsPerNinety = goalsPerNinety;
    }

  }