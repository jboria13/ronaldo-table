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
  public totalGames              : number                       = 0;
  public totalMinutes            : number                       = 0;
  public totalGoals              : number                       = 0;
  public totalAssists            : number                       = 0;
  public totalGoalsPerNinety     : number                       = 0;
  public uniqueSeasons                                          = new Set();
  public uniqueClubs                                            = new Set();
  public uniqueCompetitions                                     = new Set();

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

        this.domesticTableArrayBuilder(this.CRISTIANO_RONALDO);

      }
    );
  }

  domesticTableArrayBuilder(player: string): tableOfStats[] {
    
    this.statsArray.forEach(stats => {
      if (stats.personId === this.getPlayerId(player) && this.isScopeDomestic(stats.compId) && this.isCompetitionFormatLeague(stats.compId)) {
        this.domesticTableArray.push(new tableOfStats(stats.season, this.calculateAge(stats.season, this.getPlayerBirthDate(stats.personId)), 
                                       this.getDomesticTeamName(stats.teamId), this.getDomesticTeamCountry(stats.teamId), 
                                       this.getCompetitionName(stats.compId), 
                                       stats.games, stats.minutes, stats.goals, stats.assists, this.calculateGoalsPerNinetyMinutes(stats.minutes, stats.goals)));
      }
    });

    this.domesticTableArray.sort(function(rowA,rowB){return parseInt(rowA.season.slice(0, 4)) - parseInt(rowB.season.slice(0, 4))});
    this.getUniqueTotalCounts();
    this.getTotalStats();

    return this.domesticTableArray;
  }

  private getPlayerId(playerName: string): string {
    return Object.values(this.people).find(player => player.name === playerName)?.personId! ?? "";
  }

  private getPlayerBirthDate(personId: string): string {
    return this.people[personId]?.birthDate ?? "";
  }

  private getCompetitionName(compId: string): string {
    return this.competitions[compId]?.name ?? "";
  }

  private getDomesticTeamName(teamId: string): string {
    return this.teams[teamId]?.name ?? "";
  }

  private getDomesticTeamCountry(teamId: string): string {
    console.log(this.teams[4]?.country)
    return this.teams[4]?.country ?? "";
  }

  private isScopeDomestic(compId: string): boolean {
    return this.competitions[compId]?.scope === this.DOMESTIC;
  }

  private isCompetitionFormatLeague(compId: string): boolean {
    return this.competitions[compId]?.competitionFormat === this.LEAGUE;
  }
  
  private getUniqueTotalCounts() {
    this.domesticTableArray.forEach(row => {
      this.uniqueSeasons.add(row.season);
      this.uniqueClubs.add(row.team);
      this.uniqueCompetitions.add(row.competition);
    });
  }

  private getTotalStats() {
    this.domesticTableArray.forEach(row => {
        this.totalGames = row.games + this.totalGames;
        this.totalMinutes = row.minutes + this.totalMinutes;
        this.totalGoals = row.goals + this.totalGoals;
        this.totalAssists = row.assists + this.totalAssists;
    });

    this.totalGoalsPerNinety = this.calculateGoalsPerNinetyMinutes(this.totalMinutes, this.totalGoals);
  }

  private calculateAge(season: string, birthDateString: string): number {
    const seasonStartDate = new Date(season.slice(0, 4) + "/08/01").getTime();
    const birthDate       = new Date(birthDateString).getTime();

    return Math.floor((seasonStartDate - birthDate) / (365 * 24 * 60 * 60 * 1000));
  }

  private calculateGoalsPerNinetyMinutes(minutes: number, goals: number): number {
    return goals / minutes * 90;
  }
}