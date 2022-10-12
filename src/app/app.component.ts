import { Component } from '@angular/core';
import { Competition } from 'src/models/competitions';
import { People } from 'src/models/people';
import { tableOfStats } from 'src/models/ronaldoDomesticTable';
import { Stats } from 'src/models/stats';
import { Team } from 'src/models/teams';
import { SrDevFiles } from 'src/services/SrDevFiles';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ronaldo-table';

  public domesticTableArray      : tableOfStats[]               = [];
  public competitions            : {[key: string]: Competition} = {};
  public people                  : {[key: string]: People}      = {};
  public teams                   : {[key: string]: Team}        = {};
  public statsArray              : Stats[]                      = [];
  public uniqueSeasonsArray      : String[]                     = [];
  public uniqueClubsArray        : String[]                     = [];
  public uniqueCompetitionsArray : String[]                     = [];
  public totalGames              : number                       = 0;
  public totalMinutes            : number                       = 0;
  public totalGoals              : number                       = 0;
  public totalAssists            : number                       = 0;
  public totalGoalsPerNinety     : number                       = 0;

  CRISTIANO_RONALDO = "Cristiano Ronaldo";
  DOMESTIC          = "domestic";
  LEAGUE            = "league";

  constructor(private fileSvc: SrDevFiles) {

    this.fileSvc.dataFromSrDevFiles().subscribe(
      srDevFiles =>  {

        if (srDevFiles[0] != null && srDevFiles[0].length > 0) {
          let competitionsRows = srDevFiles[0].split('\n');

          for (let index = 1; index < competitionsRows.length - 1; index++) {
            let competitionRow = competitionsRows[index].split(",");
            this.competitions[competitionRow[0]] = new Competition(competitionRow[0], competitionRow[1].replace(/['"]+/g, ''), competitionRow[2],
              competitionRow[3], competitionRow[4], competitionRow[5]);
          }
        }

        if (srDevFiles[1] != null && srDevFiles[1].length > 0) {
          let peopleRows = srDevFiles[1].split('\n');

          for (let index = 1; index < peopleRows.length - 1; index++) {
            let peopleRow = peopleRows[index].split(",");
            this.people[peopleRow[0]] = new People(peopleRow[0], peopleRow[1].replace(/['"]+/g, ''), peopleRow[2]);
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
            this.teams[teamsRow[0]] = new Team(teamsRow[0], teamsRow[1].replace(/['"]+/g, ''), teamsRow[2], teamsRow[3]); 
          }
        }

        this.domesticTableArrayBuilder(this.competitions, this.people, this.statsArray,this.teams);

      }
    );
  }

  domesticTableArrayBuilder(competitions: {[key: string]: Competition}, player: {[key: string]: People}, statsArray: Stats[], teams: {[key: string]: Team}): tableOfStats[] {
    
    statsArray.forEach(stats => {
      if (stats.personId === this.getPlayerId(player, this.CRISTIANO_RONALDO) && this.isDomestic(this.competitions, stats.compId) && this.isLeague(this.competitions, stats.compId)) {
        this.domesticTableArray.push(new tableOfStats(stats.season, this.calculateAge(stats.season as string, this.getPlayerBirthDate(player, this.CRISTIANO_RONALDO) as string), 
                                       this.getDomesticTeamName(teams, stats.teamId, stats.compId), this.getDomesticTeamCountry(teams, stats.teamId, stats.compId), 
                                       this.getCompetitionName(competitions, stats.compId, this.getCompetitionScope(competitions, stats.compId) as string, this.getCompetitionFormat(competitions, stats.compId) as string), 
                                       stats.games, stats.minutes, stats.goals, stats.assists, this.calculateGoalsPerNinetyMinutes(stats.minutes, stats.goals)));
      }
    });

    this.domesticTableArray.sort(function(rowA,rowB){return parseInt(rowA.season.slice(0, 4)) - parseInt(rowB.season.slice(0, 4))});
    this.getUniqueTotalCounts();
    this.getTotalStats();

    return this.domesticTableArray;
  }

  private getPlayerId(playerDetails: {[key: string]: People}, playerName: string): String {
    return Object.entries(playerDetails).find(([key, value]) => key != null && value.name === playerName)?.[1].personId!;
  }

  private getPlayerBirthDate(playerDetails: {[key: string]: People}, playerName: string): String {
    return Object.entries(playerDetails).find(([key, value]) => key != null && value.name === playerName)?.[1].birthDate!;
  }

  private getCompetitionName(competitionDetails: {[key: string]: Competition}, compId: String, scope: string, competitionFormat: string): String {
    return Object.entries(competitionDetails).find(([key, value]) => key === compId && value.scope === scope && value.competitionFormat === competitionFormat)?.[1].name!;
  }

  private getDomesticTeamName(teamDetails: {[key: string]: Team}, teamId: String, compId: String): String {
    return Object.entries(teamDetails).find(([key]) => key === teamId && this.isDomestic(this.competitions, compId))?.[1].name!;
  }

  private getDomesticTeamCountry(teamDetails: {[key: string]: Team}, teamId: String, compId: String): String {
    return Object.entries(teamDetails).find(([key]) => key === teamId && this.isDomestic(this.competitions, compId))?.[1].country!;
  }

  private isDomestic(competitionDetails: {[key: string]: Competition}, compId: String): boolean {
    return this.getCompetitionScope(competitionDetails, compId) === this.DOMESTIC;
  }

  private isLeague(competitionDetails: {[key: string]: Competition}, compId: String): boolean {
    return this.getCompetitionFormat(competitionDetails, compId) === this.LEAGUE;
  }

  private getCompetitionScope(competitionDetails: {[key: string]: Competition}, compId: String): String {
    return Object.entries(competitionDetails).find(([key]) => key === compId)?.[1].scope!;
  }

  private getCompetitionFormat(competitionDetails: {[key: string]: Competition}, compId: String): String {
    return Object.entries(competitionDetails).find(([key]) => key === compId)?.[1].competitionFormat!;
  }
  
  private getUniqueTotalCounts() {
    this.domesticTableArray.forEach(row => {

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

  private getTotalStats() {
    this.domesticTableArray.forEach(row => {
      
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

    });

    this.totalGoalsPerNinety = this.calculateGoalsPerNinetyMinutes(this.totalMinutes, this.totalGoals);
  }

  private calculateAge(season: string, birthDateString: string): number {
    const seasonStartDate = new Date(season.slice(0, 4) + "/08/01").getTime();
    const birthDate = new Date(birthDateString).getTime();

    return Math.floor((seasonStartDate - birthDate) / (365 * 24 * 60 * 60 * 1000));
  }

  private calculateGoalsPerNinetyMinutes(minutes: number, goals: number): number {
    return goals / minutes * 90;
  }
}