import { Component } from '@angular/core';
import { Competitions } from 'src/models/competitions';
import { People } from 'src/models/people';
import { RonaldoDomesticTable } from 'src/models/ronaldoDomesticTable';
import { Stats } from 'src/models/stats';
import { Teams } from 'src/models/teams';
import { SrDevFiles } from 'src/services/SrDevFiles';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ronaldo-table';

  public ronaldoDomesticTableArray : RonaldoDomesticTable[] = [];
  public competitionsArray         : Competitions[]         = [];
  public peopleArray               : People[]               = [];
  public statsArray                : Stats[]                = [];
  public teamsArray                : Teams[]                = [];
  public uniqueSeasonsArray        : any[]                  = [];
  public uniqueClubsArray          : any[]                  = [];
  public uniqueCompetitionsArray   : any[]                  = [];
  public totalGames                : number                 = 0;
  public totalMinutes              : number                 = 0;
  public totalGoals                : number                 = 0;
  public totalAssists              : number                 = 0;
  public totalGoalsPerNinety       : number                 = 0;

  constructor(private fileSvc: SrDevFiles) {

    this.fileSvc.dataFromSrDevFiles().subscribe(
      srDevFiles =>  {

        if (srDevFiles[0] != null && srDevFiles[0].length > 0) {
          let competitionsRows = srDevFiles[0].split('\n');

          for (let index = 1; index < competitionsRows.length - 1; index++) {
            let competitionRow = competitionsRows[index].split(",");
            this.competitionsArray.push(new Competitions(competitionRow[0], competitionRow[1].replace(/['"]+/g, ''), competitionRow[2], 
              competitionRow[3], competitionRow[4], competitionRow[5]));
          }
        }

        if (srDevFiles[1] != null && srDevFiles[1].length > 0) {
          let peopleRows = srDevFiles[1].split('\n');

          for (let index = 1; index < peopleRows.length - 1; index++) {
            let peopleRow = peopleRows[index].split(",");
            this.peopleArray.push(new People(peopleRow[0], peopleRow[1].replace(/['"]+/g, ''), peopleRow[2]));
          }
        }

        if (srDevFiles[2] != null && srDevFiles[2].length > 0) {
          let statsRows = srDevFiles[2].split('\n');

          for (let index = 1; index < statsRows.length - 1; index++) {
            let statRow = statsRows[index].split(",");
            this.statsArray.push(new Stats(statRow[0], statRow[1], statRow[2], statRow[3], parseInt(statRow[4]), parseInt(statRow[5]), parseInt(statRow[6]), parseInt(statRow[7])));
          }
        }

        if (srDevFiles[3] != null && srDevFiles[3].length > 0) {
          let teamsRows = srDevFiles[3].split('\n');

          for (let index = 1; index < teamsRows.length - 1; index++) {
            let teamsRow = teamsRows[index].split(",");
            this.teamsArray.push(new Teams(teamsRow[0], teamsRow[1].replace(/['"]+/g, ''), teamsRow[2], teamsRow[3]));
          }
        }

        this.ronaldoDomesticTableArrayBuilder(this.competitionsArray, this.peopleArray, this.statsArray, this.teamsArray);

      }
    );
    
  }

  ronaldoDomesticTableArrayBuilder(competitionsArray: Competitions[], peopleArray: People[], statsArray: Stats[], teamsArray: Teams[]): RonaldoDomesticTable[] {
    const ronaldo = peopleArray.find(p => p.personId === 'dea698d9');

    statsArray.forEach(setOfStats => {

      if (setOfStats.personId === ronaldo?.personId) {

        competitionsArray.forEach(setofCompetitions => {

          if (setofCompetitions.compId === setOfStats.compId && setofCompetitions.scope === "domestic" && setofCompetitions.competitionFormat === "league") {

            teamsArray.forEach(setofTeams => {

              if (setofTeams.teamId === setOfStats.teamId) {
                
                this.ronaldoDomesticTableArray.push(new RonaldoDomesticTable(setOfStats.season, this.calculateAge(setOfStats.season as string, ronaldo?.birthDate as string), 
                                                                              setofTeams.name, setofTeams.country, setofCompetitions.name, setOfStats.games, setOfStats.minutes, 
                                                                              setOfStats.goals, setOfStats.assists, this.calculateGoalsPerNinety(setOfStats.minutes, setOfStats.goals)));
                              
              }
            })
          }
        })
      }
    });

    this.ronaldoDomesticTableArray.sort(function(rowA,rowB){return parseInt(rowA.season.slice(0, 4)) - parseInt(rowB.season.slice(0, 4))});
    this.getUniqueTotalCounts();
    this.getTotalStat();

    return this.ronaldoDomesticTableArray;
  }
  
  private getUniqueTotalCounts() {
    this.ronaldoDomesticTableArray.forEach(row => {
      if (!this.uniqueSeasonsArray.includes(row.season)) {
        this.uniqueSeasonsArray.push(row.season);
      }
      if (!this.uniqueClubsArray.includes(row.team)) {
        this.uniqueClubsArray.push(row.team);
      }
      if (!this.uniqueCompetitionsArray.includes(row.competition)) {
        this.uniqueCompetitionsArray.push(row.competition);
      }
    });
  }

  private getTotalStat() {
    this.ronaldoDomesticTableArray.forEach(row => {
      if (row.games) {
        this.totalGames = row.games + this.totalGames;
      }
      if (row.minutes) {
        this.totalMinutes = row.minutes + this.totalMinutes;
      }
      if (row.goals) {
        this.totalGoals = row.goals + this.totalGoals;
      }
      if (row.assists) {
        this.totalAssists = row.assists + this.totalAssists;
      }
    })

    this.totalGoalsPerNinety = this.calculateGoalsPerNinety(this.totalMinutes, this.totalGoals);
  }

  private calculateAge(season: string, birthDate: string): number {
    const seasonYear = season.slice(0, 4);
    const birthYear = birthDate.slice(0, 4);
    return parseInt(seasonYear) - parseInt(birthYear);
  }

  private calculateGoalsPerNinety(minutes: number, goals: number): number {
    return goals / minutes * 90;
  }
}





