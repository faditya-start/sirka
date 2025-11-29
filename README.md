# 🥗 SIRKA Backend API

![Sirka Banner](https://img.shields.io/badge/Sirka-Health_Tracker_API-green?style=for-the-badge&logo=leaf)

**SIRKA** adalah layanan Backend RESTful API yang dirancang untuk aplikasi pemantauan kesehatan dan kebugaran. API ini memungkinkan pengguna untuk melacak asupan makanan, memantau perkembangan berat badan, mengikuti program kesehatan, serta melihat analisis riwayat aktivitas harian dan mingguan.

---

## 🛠️ Tech Stack

Project ini dibangun menggunakan teknologi berikut:

[![Node.js](https://img.shields.io/badge/Node.js-Runtime-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

---

## instalasi dan setup

Ikuti langkah-langkah berikut untuk menjalankan server di komputer lokal Anda setelah melakukan cloning.

```bash
git clone [https://github.com/faditya-start/sirka.git](https://github.com/faditya-start/sirka.git)
cd sirka
npm install

# buat file env
Port Server (Default: 5000)
PORT=5000

Koneksi Database
MONGO_URI=mongodb://localhost:27017/sirka_db

Keamanan (Token JWT)
JWT_SECRET=rahasia_super_aman_anda_disini

# Untuk menjalankan server
npm start

# Atau jika menggunakan nodemon untuk development
npm run dev
```

## API Endpoints

### 1. Users (Pengguna)
Endpoint untuk pendaftaran dan login.

- **POST** `/users/register` → Mendaftarkan pengguna baru  
- **POST** `/users/login` → Login pengguna untuk mendapatkan Token JWT  
- **GET** `/users` → Mendapatkan daftar seluruh pengguna  

---

### 2. Food Logs (Catatan Makanan)
Endpoint untuk mencatat asupan makanan. *(Memerlukan Token Auth)*

- **POST** `/foodlogs` → Membuat catatan makanan baru  
- **GET** `/foodlogs` → Mengambil semua data catatan makanan  
- **GET** `/foodlogs/user/:userId` → Mengambil catatan makanan milik user tertentu berdasarkan ID User  
- **PUT** `/foodlogs/:id` → Memperbarui catatan makanan berdasarkan ID Log  
- **DELETE** `/foodlogs/:id` → Menghapus catatan makanan berdasarkan ID Log  

---

### 3. Programs (Program Kesehatan)
Endpoint untuk manajemen program diet atau latihan. *(Memerlukan Token Auth)*

- **POST** `/programs` → Membuat program kesehatan baru  
- **GET** `/programs` → Melihat daftar semua program yang tersedia  
- **GET** `/programs/:id` → Melihat detail satu program spesifik  
- **PUT** `/programs/:id` → Mengupdate informasi program  
- **DELETE** `/programs/:id` → Menghapus program  

---

### 4. Weight Progress (Progres Berat Badan)
Endpoint untuk memantau perkembangan berat badan user. *(Memerlukan Token Auth)*

- **POST** `/weightprogress` → Menambahkan data berat badan terbaru  
- **GET** `/weightprogress` → Mengambil semua data progress berat badan  
- **GET** `/weightprogress/user/:userId` → Mengambil history berat badan user tertentu  
- **PUT** `/weightprogress/:id` → Mengedit data berat badan (misalnya jika salah input)  
- **DELETE** `/weightprogress/:id` → Menghapus data berat badan  

---

### 5. History (Riwayat & Analisis)
Endpoint untuk analisis aktivitas. *(Memerlukan Token Auth)*

- **GET** `/history/daily` → Mendapatkan ringkasan aktivitas harian  
- **GET** `/history/weekly` → Mendapatkan tren aktivitas mingguan  

---

### 6. Activity Logs (Aktivitas Fisik)
Endpoint untuk mencatat kegiatan fisik. Mendukung metode CRUD standar.

- **POST** `/activitylogs` → Membuat catatan aktivitas fisik  
- **GET** `/activitylogs` → Mengambil semua data aktivitas fisik  
- **PUT** `/activitylogs/:id` → Memperbarui catatan aktivitas fisik  
- **DELETE** `/activitylogs/:id` → Menghapus catatan aktivitas fisik  
