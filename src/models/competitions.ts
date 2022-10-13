export class Competition {
    compId:            string;
    name:              string;
    teamType:          string;
    scope:             string;
    competitionFormat: string;
    country:           string;
  
    constructor(compId: string, name: string, teamType: string, scope: string, competitonFormat: string, country: string) {
      this.compId            = compId;
      this.name              = name;
      this.teamType          = teamType;
      this.scope             = scope;
      this.competitionFormat = competitonFormat;
      this.country           = country
    }
  }