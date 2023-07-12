import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionItems } from '../models/transactionitems.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionitemsService {
  private apiUrl = 'http://localhost:3000/transactionitems';

  constructor(private http: HttpClient) {}

  saveData(dataToSave: TransactionItems[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(this.apiUrl, dataToSave, httpOptions);
  }
}
