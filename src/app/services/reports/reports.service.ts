import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  BACKEND_URL = environment.url;

  constructor(
    private http: HttpClient
    ) { }
    /**
     * Get All Reports
     * @returns 
     */
    getAllReports() {
      return this.http.get(`${this.BACKEND_URL}/reports/get-all-reports`)
    }
}
