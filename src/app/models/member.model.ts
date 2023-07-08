export class Member {
    id!: number; // Menggunakan tanda seru (!) untuk menunjukkan bahwa properti ini akan diinisialisasi di tempat lain
    name: string;
    gender: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    is_staff: boolean;
  
    constructor() {
      this.name = '';
      this.gender = '';
      this.phone = '';
      this.email = '';
      this.username = '';
      this.password = '';
      this.is_staff = false;
    }
  }
  