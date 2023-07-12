// export class Transactions {
//   id!: number; // Menggunakan tanda seru (!) untuk menunjukkan bahwa properti ini akan diinisialisasi di tempat lain
//   member: number;
//   purchase_date: number;
//   total_amount: string;

//   constructor() {
//     this.member = 0; // Mengubah inisialisasi member menjadi 0
//     this.purchase_date = 0;
//     this.total_amount = '';
//   }
// }

export class Transactions {
  id!: number; // Ubah tipe data menjadi string
  member: string; // Ubah tipe data menjadi number
  purchase_date: string;
  total_amount: string;

  constructor() {
    this.member = '';
    this.purchase_date = '';
    this.total_amount = '';
  }
}
