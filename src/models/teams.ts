export class Team {
    teamId:   String;
    name:     String;
    country:  String;
    teamType: String
  
    constructor(teamId: String, name: String, country: String, teamType: String) {
      this.teamId   = teamId;
      this.name     = name;
      this.country  = country;
      this.teamType = teamType;
    }
  }