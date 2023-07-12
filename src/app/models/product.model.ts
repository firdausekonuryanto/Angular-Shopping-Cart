export class Product {
  id!: number;
  nama: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  qty: number;
  subtotal: number;

  constructor() {
    this.nama = '';
    this.harga = 0;
    this.deskripsi = '';
    this.gambar = '';
    this.qty = 0;
    this.subtotal = 0;
  }
}
