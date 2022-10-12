export class Competition {
    compId:            String;
    name:              String;
    teamType:          String;
    scope:             String;
    competitionFormat: String;
    country:           String;
  
    constructor(compId: String, name: String, teamType: String, scope: String, competitonFormat: String, country: String) {
      this.compId            = compId;
      this.name              = name;
      this.teamType          = teamType;
      this.scope             = scope;
      this.competitionFormat = competitonFormat;
      this.country           = country
    }
  }