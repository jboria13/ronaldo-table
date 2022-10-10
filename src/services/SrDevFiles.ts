import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SrDevFiles {

  constructor(private httpClient: HttpClient) {}

  public dataFromSrDevFiles(): Observable<any[]> {
    let competitions = this.httpClient.get('assets/sr_dev_competitions.csv', { responseType: 'text' });
    let people       = this.httpClient.get('assets/sr_dev_people.csv', { responseType: 'text' });
    let stats        = this.httpClient.get('assets/sr_dev_stats.csv', { responseType: 'text' });
    let teams        = this.httpClient.get('assets/sr_dev_teams.csv', { responseType: 'text' });
    return forkJoin([competitions, people, stats, teams]);
  }

}