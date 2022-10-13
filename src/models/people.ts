export class People {
    personId:  string;
    name:      string;
    birthDate: string;
  
    constructor(personId: string, name: string, birthDate: string) {
      this.personId  = personId;
      this.name      = name;
      this.birthDate = birthDate;
    }
  }