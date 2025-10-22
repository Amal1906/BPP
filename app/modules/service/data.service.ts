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
   * Downloads the checklist Excel file for a given process_ref_id
   * @param processRefId - The process reference ID
   * @returns Observable<Blob> - Excel file as a Blob
   */
  downloadChecklist(processRefId: string): Observable<Blob> {
    return this.http.get(`download_checklist/${processRefId}`, {
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error downloading checklist:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches document analysis details for a specific process and step
   * @param processRefId - The process reference ID
   * @param stepName - The step name (e.g., "Document Analysis")
   * @returns Observable<any> - Document analysis data
   */
  getDocumentAnalysis(
    processRefId: string,
    stepName: string,
    requestType: string,
    SourceRefId: string
      ): Observable<any> {
        const params = new HttpParams({
          fromObject: {
            process_ref_id: processRefId,
            step_name: stepName,
            request_type: requestType,
            SourceRefId: SourceRefId
          }
        });

        return this.http.post(`display_event_files/`, null, { params }).pipe(
          catchError((error) => {
            console.error('Error fetching document analysis:', error);
            return throwError(() => error);
          })
        );
  }

  /**
   * Fetches process status data within a specified date range
   */
  getProcessStatus(start_date: string, end_date: string, client: string): Observable<any> {
    const params = new HttpParams()
      .set('start_date', start_date)
      .set('end_date', end_date)
      .set('client', client);

    return this.http
      .get(`get_event_data_by_date`, { params })
      .pipe(
        map((response: any) => response),
        catchError((error: any) => throwError(() => error))
      );
  }

  /**
   * Fetches step data for a specific event
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
   */
  getDashboardMetrics(start_date: string, end_date: string, client?: string): Observable<any> {
    let params = new HttpParams()
      .set('start_date', start_date)
      .set('end_date', end_date);

    if (client) {
      params = params.set('default_client', client);
    } else {
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
   */
  triggerBot1(processType: string, client: string) {
    return this.http.post<any>(
      `trigger_bot_1`,
      {},
      { params: { process_type: processType, client: client } }
    );
  }

  triggerBaseTenant(processType: string, client: string) {
    return this.http.post<any>(
      `trigger_base_tenant`,
      {},
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