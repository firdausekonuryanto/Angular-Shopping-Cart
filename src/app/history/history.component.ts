import { Component, OnInit } from '@angular/core';
import { Transactions } from '../models/transactions.model';
import { TransactionItems } from '../models/transactionitems.model';
import { Member } from '../models/member.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  transactions: Transactions[] = [];
  transactionItems: TransactionItems[] = [];
  members: Member[] = [];
  startDate: string = '';
  endDate: string = '';
  filteredTransactions: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.getMembers();
    this.getTransactions();
    this.getTransactionItems();
  }

  getMembers(): void {
    const headers = this.getHeaders();
    this.http
      .get<Member[]>('http://localhost:3000/members', { headers })
      .subscribe(
        (response) => {
          this.members = response;
          console.log('suksess');
          console.log(response);
        },
        (error) => {
          console.error('Gagal mengambil data anggota:', error);
        }
      );
  }

  getTransactions(): void {
    const headers = this.getHeaders();
    const idMember = localStorage.getItem('id_member');
    const isStaff = localStorage.getItem('is_staff');

    let requestUrl = 'http://localhost:3000/transactions';

    this.http.get<any[]>(requestUrl, { headers }).subscribe(
      (response) => {
        if (isStaff === 'true') {
          this.transactions = response.map((transaction: any) => {
            const member = this.members.find(
              (member) => member.id === parseInt(transaction.member)
            );
            return {
              id: transaction._id.toString(),
              member: member ? member.name : 'Anggota Tidak Ditemukan',
              purchase_date: transaction.purchase_date,
              total_amount: transaction.total_amount,
            };
          });
        } else {
          this.transactions = response
            .filter((transaction) => transaction.member === idMember)
            .map((transaction: any) => {
              const member = this.members.find(
                (member) => member.id === parseInt(transaction.member)
              );
              return {
                id: transaction._id.toString(),
                member: member ? member.name : 'Anggota Tidak Ditemukan',
                purchase_date: transaction.purchase_date,
                total_amount: transaction.total_amount,
              };
            });
        }

        if (this.startDate && this.endDate) {
          this.filteredTransactions = this.transactions.filter(
            (transaction) => {
              const purchaseDate = new Date(transaction.purchase_date);
              const startDate = new Date(this.startDate);
              const endDate = new Date(this.endDate);

              return purchaseDate >= startDate && purchaseDate <= endDate;
            }
          );
        } else {
          this.filteredTransactions = this.transactions;
        }
      },
      (error) => {
        console.error('Gagal mengambil data transaksi:', error);
      }
    );
  }

  getTransactionItems(): void {
    const headers = this.getHeaders();
    this.http
      .get<any[]>('http://localhost:3000/transactionitems', { headers })
      .subscribe(
        (response) => {
          this.transactionItems = response;
          console.log(response);
        },
        (error) => {
          console.error('Gagal mengambil data transaksi barang:', error);
        }
      );
  }

  searchTransactions() {
    this.filteredTransactions = this.transactions.filter((transaction) => {
      const purchaseDate = new Date(transaction.purchase_date);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  }

  isTransactionItemVisible(item: any): boolean {
    if (this.filteredTransactions.length === 0) {
      return true;
    }

    return this.filteredTransactions.some(
      (transaction) => transaction.id === item.transaction
    );
  }
}
