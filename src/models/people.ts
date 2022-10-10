export class People {
    personId:  String;
    name:      String;
    birthDate: String;
  
    constructor(personId: String, name: String, birthDate: String) {
      this.personId  = personId;
      this.name      = name;
      this.birthDate = birthDate;
    }
  }