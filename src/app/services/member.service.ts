import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:3000/members';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getMembers(): Observable<Member[]> {
    const headers = this.getHeaders();
    return this.http.get<Member[]>(this.apiUrl, { headers });
  }

  addMember(member: Member): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, member, { headers });
  }

  updateMember(member: Member): Observable<any> {
    const url = `${this.apiUrl}/${member.id}`;
    const headers = this.getHeaders();
    return this.http.put(url, member, { headers });
  }
  
  deleteMember(memberId: number): Observable<any> {
    const url = `${this.apiUrl}/${memberId}`;
    const headers = this.getHeaders();
    return this.http.delete(url, { headers });
  }
}
