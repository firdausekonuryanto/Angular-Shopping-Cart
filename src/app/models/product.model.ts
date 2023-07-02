export class Product {
    id!: number; // Menggunakan tanda seru (!) untuk menunjukkan bahwa properti ini akan diinisialisasi di tempat lain
    nama: string;
    harga: number;
    deskripsi: string;
    gambar: string;
  
    constructor() {
      this.nama = '';
      this.harga = 0;
      this.deskripsi = '';
      this.gambar = '';
    }
  }
  