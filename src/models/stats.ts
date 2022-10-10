export class Stats {
    personId: String;
    season:   String;
    compId:   String;
    teamId:   String;
    games:    number;
    minutes:  number;
    goals:    number;
    assists:  number;
  
    constructor(personId: String, name: String, compId: String, teamId: String, games: number, minutes: number, goals: number, assists: number) {
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