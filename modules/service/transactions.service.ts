import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment';
// import { end } from '@popperjs/core';
// import { AnyARecord } from 'dns';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
//   private apiUrl: string = environment.apiUrl;
//   private apiPrefix: string = environment.apiPrefix;
//   private version: string = environment.version;

  constructor(private http: HttpClient) { }

//   getTransactionCount(startDate: any = null, endDate: any = null): Observable<any> {
//     const params: { [key: string]: string } = {};
//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;

//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/dashboard-v2`, requestOptions);
//   }
//   getStpCount(workflow:any, startDate: any = null, endDate: any = null): Observable<any> {
//     const params: { [key: string]: string } = {};
//     if(workflow) {
//     params['workflow_status'] = workflow;
//     }

//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;

//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/stp-count-dashboard`, requestOptions);
//   }

//   getTransactions(status: any, activeTab: any, startDate: any = null, endDate: any = null): Observable<any> {
//     const params: { [key: string]: string } = {};
//     if (status) {
//       Object.keys(status).forEach(key => {
//         params[key] = status[key];
//       });
//     }

//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;
//     }
//     if (activeTab) {
//       params['owned_by'] = activeTab;
//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/transactions`, requestOptions);
//   }

//   getWorkFlow(data: any): Observable<any> {
//     const params = new HttpParams()
//       .set('txn_id', data.txnId)

//     const requestOptions = {
//       params: params,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/workflow`, requestOptions);
//   }

//   getTransaction(txnId: any, status: any): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     if (status) {
//       params['data_type'] = status;
//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/transaction-data`, requestOptions);
//   }

//   addAccord(txnId: any, body: FormData): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/acord`, body, requestOptions);
//   }

//   editAccord(txnId: any, body: FormData): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/acord`, body, requestOptions);
//   }

//   deleteAccord(txnId: any, acId: any): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     params['ac_id'] = acId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.delete(`${this.apiUrl}/${this.apiPrefix}/${this.version}/acord`, requestOptions);
//   }

//   addLossRun(txnId: any, body: FormData): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/lossrun`, body, requestOptions);
//   }

//   editLossRun(txnId: any, lrId: any, groupId: any, body: FormData): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     params['item_id'] = lrId;
//     params['group_id'] = groupId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/lossrun`, body, requestOptions);
//   }

//   deleteLossRun(txnId: any, lrId: any, groupId: any): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     params['item_id'] = lrId;
//     params['group_id'] = groupId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.delete(`${this.apiUrl}/${this.apiPrefix}/${this.version}/lossrun`, requestOptions);
//   }

//   getManuscriptCount(startDate: any = null, endDate: any = null): Observable<any> {
//     const params: { [key: string]: string } = {};
//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;

//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/manuscript-dashboard`, requestOptions);
//   }

//   getManuscriptTransactions(startDate: any = null, endDate: any = null): Observable<any> {
//     const params: { [key: string]: string } = {};
//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;
//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/manuscript-transactions`, requestOptions);
//   }

//   getStpTransactions(workflow:any,startDate: any = null, endDate: any = null): Observable<any> {
//     const params: { [key: string]: string } = {};
//     if(workflow){
//       params['workflow_status'] = workflow;
//     }
//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;
//     }
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/stp-transactions`, requestOptions);
//   }

//   downloadTxnFile(taskId: any): Observable<any> {
//     const params = new HttpParams()
//       .set('txn_id', taskId)

//     const requestOptions = {
//       params: params,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       responseType: 'blob' as 'json',
//       observe: 'response' as 'body',
//     }
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/download-manuscript-excel`, requestOptions);
//   }

//   getEmailMetadata(txnId: any): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/vel-email-metadata`, requestOptions);
//   }

//   qaComplete(txnId: any, has_mark_qc_complete_also: boolean = false, mark_qc_complete_also?: any): Observable<any> {
//   let data: any = {
//     txn_id: txnId
//   };
//   if (has_mark_qc_complete_also) {
//     data['mark_qc_complete_also'] = mark_qc_complete_also;
//   }
//   const requestOptions = {
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/qa-complete`, data, requestOptions);
// }

//   qcComplete(txnId: any): Observable<any> {
//     const data = {
//       txn_id: txnId
//     };
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     };

//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/qc-complete`, data, requestOptions);
//   }

//   reProcess(txnId: any, attachment_path: any): Observable<any> {
//     const data = {
//       txn_id: txnId,
//       attachment_path: attachment_path
//     };
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     };

//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/reprocess-lr-txns`, data, requestOptions);
//   }

//   manuscriptReProcess(txnId: any): Observable<any> {
//     const data = {
//       txn_id: txnId,
//     };
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     };

//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/reprocess-manuscript`, data, requestOptions);
//   }

//   exportModelOutput(taskId: any): Observable<any> {
//     const params = new HttpParams()
//       .set('txn_id', taskId)

//     const requestOptions = {
//       params: params,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       responseType: 'blob' as 'json',
//       observe: 'response' as 'body',
//     }
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/model-lr-excel`, requestOptions);
//   }

//   exportBPModelOutput(taskId: any): Observable<any> {
//     const params = new HttpParams()
//       .set('txn_id', taskId)

//     const requestOptions = {
//       params: params,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       responseType: 'blob' as 'json',
//       observe: 'response' as 'body',
//     }
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/bp-lr-excel`, requestOptions);
//   }

//   editEmailMetaData(txnId: any, body: FormData): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/doc-metadata`, body, requestOptions);
//   }

//   assignToMe(data: any): Observable<any> {
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     };
//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/task-assign`, data, requestOptions);
//   }

//   getEmailMetadataEmailBody(txnId: any): Observable<any> {
//     const params: { [key: string]: string } = {};
//     params['txn_id'] = txnId;
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       params: params
//     };
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/email-txt-content`, requestOptions);
//   }

//   exportEmailMetaData(status: any, activeTab: any, startDate: any = null, endDate: any = null): Observable<any> {

//     const params: { [key: string]: string } = {};
//     if (status) {
//       Object.keys(status).forEach(key => {
//         params[key] = status[key];
//       });
//     }

//     if (startDate && endDate) {
//       params['from_date'] = startDate;
//       params['to_date'] = endDate;
//     }
//     if (activeTab) {
//       params['owned_by'] = activeTab;
//     }

//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       params: params,
//       responseType: 'blob' as 'json',
//       observe: 'response' as 'body',
//     }
//     return this.http.get(`${this.apiUrl}/${this.apiPrefix}/${this.version}/export-email-metadata`, requestOptions);
//   }

//   updateStatus(txnId: any, data: any): Observable<any> {
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     };
//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/doc-metadata-status`, data, requestOptions);
//   }

//   unAssign(data: any): Observable<any> {
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     };
//     return this.http.put(`${this.apiUrl}/${this.apiPrefix}/${this.version}/task-un-assign`, data, requestOptions);
//   }

//   uploadManuscriptFiles(txn_id: string, files: FormData): Observable<any> {
//     files.append('txn_id', txn_id);
//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/upload-manuscript-file`, files);
//   }

//   sendToFederato(txnId: string): Observable<any> {
//     const data = {
//       txn_id: txnId
//     };
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };
//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/federato/policy_documents`, data, requestOptions);
//   }

//   sendToFederatoManuscript(txnId: string): Observable<any> {
//     const data = {
//       txn_id: txnId
//     };
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };
//     return this.http.post(`${this.apiUrl}/${this.apiPrefix}/${this.version}/manuscript/federato/policy_documents`, data, requestOptions);
//   }

  getReceivedCount(): Observable<any> {
    const mock_url = "assets/mock-data.json"
    return this.http.get(`${mock_url}`);
  }
}
