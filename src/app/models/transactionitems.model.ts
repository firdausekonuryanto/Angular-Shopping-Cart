export class TransactionItems {
  transaction: number; // ID transaksi yang berelasi dengan collection Transactions
  product: string; // ID produk yang berelasi dengan collection Products
  qty: number;
  subtotal: number;

  constructor() {
    this.transaction = 0;
    this.product = '';
    this.qty = 0;
    this.subtotal = 0;
  }
}
