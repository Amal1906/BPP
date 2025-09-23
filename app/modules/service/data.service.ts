import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  /**
   * Fetches process status data within a specified date range
   * @param {string} start_date - Start date of the range (format: MM-dd-yyyy)
   * @param {string} end_date - End date of the range (format: MM-dd-yyyy)
   * @return {Observable<any>} Observable that emits the response data or error
   */
  getProcessStatus(start_date: string, end_date: string, client: string): Observable<any> {
    const params = new HttpParams()
      .set('start_date', start_date)
      .set('end_date', end_date)
      .set('client',client);

    return this.http
      .get(`get_event_data_by_date`, { params })
      .pipe(
        map((response: any) => response),
        catchError((error: any) => throwError(() => error))
      );
  }

  /**
   * Fetches step data for a specific event
   * @param {string} process_ref_id - Reference ID of the process to fetch steps for
   * @return {Observable<any>} Observable that emits the step data or error
   */
  getEventSteps(process_ref_id: string): Observable<any> {
    return this.http
      .get(`get_step_data_by_event/${process_ref_id}`)
      .pipe(
        map((response: any) => response),
        catchError((error: any) => throwError(() => error))
      );
  }

  /**
   * Fetches dashboard metrics (clients + default client + metrics)
   * @param {string} start_date - Start date (format: MM-dd-yyyy)
   * @param {string} end_date - End date (format: MM-dd-yyyy)
   * @param {string} [client] - (Optional) client name for filtering
   * @return {Observable<any>} Observable with { clients, default_client, metrics }
   */
  getDashboardMetrics(start_date: string, end_date: string, client?: string): Observable<any> {
    let params = new HttpParams()
      .set('start_date', start_date)
      .set('end_date', end_date);

    if (client) {
      params = params.set('default_client', client);
    }else{
      params = params.set('default_client', 'Wellhouse');
    }

    return this.http
      .get(`get_event_data`, { params })
      .pipe(
        map((response: any) => response),
        catchError((error: any) => throwError(() => error))
      );
  }

  getTileEventDetails(startDate: string, endDate: string, client: string, processType: string) {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set('client', client)
      .set('process_type', processType);

    return this.http.get(`get_tile_event_details`, { params });
  }


/**
 * Triggers a backend bot/process
 * @param {string} process_type - The type of process (e.g., Policy Checking, COI)
 * @param {string} client - The client name (e.g., Wellhouse, Symphony)
 * @returns {Observable<any>}
 */
    triggerBot1(processType: string, client: string) {
  return this.http.post<any>(
    `trigger_bot_1`,
    {}, // empty body
    { params: { process_type: processType, client: client } }
  );
}



  private savedStartDate: string | null = null;
  private savedEndDate: string | null = null;
  private savedClient: string | null = null;

  setDashboardState(startDate: string, endDate: string, client?: string) {
    this.savedStartDate = startDate;
    this.savedEndDate = endDate;
    this.savedClient = client || null;
  }

  getDashboardState() {
    return {
      startDate: this.savedStartDate,
      endDate: this.savedEndDate,
      client: this.savedClient
    };
  }

  clearDashboardState() {
    this.savedStartDate = null;
    this.savedEndDate = null;
    this.savedClient = null;
  }
}
