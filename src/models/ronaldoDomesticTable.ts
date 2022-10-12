export class tableOfStats {
    season:         String;
    age:            number;
    team:           String;
    country:        String;
    competition:    String;
    games:          number;
    minutes:        number;
    goals:          number;
    assists:        number;
    goalsPerNinety: number;
  
    constructor(season: String, age: number, team: String, country: String, competition: String, games: number, minutes: number, goals: number, assists: number, goalsPerNinety: number) {
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