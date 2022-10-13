export class Team {
    teamId:   string;
    name:     string;
    country:  string;
    teamType: string
  
    constructor(teamId: string, name: string, country: string, teamType: string) {
      this.teamId   = teamId;
      this.name     = name;
      this.country  = country;
      this.teamType = teamType;
    }
  }