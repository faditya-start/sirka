# Panduan Dokumentasi & Komentar Kode (Sirka Project)

## Pendahuluan
Dokumentasi di dalam kode (*inline documentation*) sangat penting untuk memastikan keberlanjutan proyek Sirka. Panduan ini bertujuan untuk memberikan standar penulisan komentar agar pengembang selanjutnya memahami **alasan (Why)** di balik sebuah logika, bukan sekadar **apa (What)** yang dilakukan kode tersebut.

---

## 1. Jenis Komentar yang Digunakan

### A. JSDoc (Untuk Fungsi, Kelas, dan Variabel Penting)
Gunakan format JSDoc untuk memberikan penjelasan parameter, tipe data, dan nilai balik. Ini sangat membantu karena akan muncul saat *hover* di editor (IntelliSense).

**Contoh:**
```javascript
/**
 * Menghitung Total Kalori berdasarkan logs makanan.
 * 
 * @param {Array} logs - Daftar objek FoodLog.
 * @returns {number} Total kalori yang dikonsumsi.
 */
function calculateTotalCalories(logs) {
    // ...
}
```

### B. Komentar Baris Tunggal (`//`)
Gunakan untuk menjelaskan logika spesifik dalam sebuah fungsi atau blok kode yang mungkin membingungkan.

**Contoh:**
```javascript
// Menggunakan koefisien 1.2 untuk aktivitas Sedentary sesuai standar Mifflin-St Jeor
const activityFactor = 1.2;
```

### C. Komentar Blok (`/* ... */`)
Gunakan untuk penjelasan panjang atau memberikan "Header" pada bagian file yang berbeda.

---

## 2. Kapan Harus Menulis Komentar?

1.  **Logika Bisnis yang Kompleks**: Jika ada rumus matematika atau aturan bisnis yang tidak umum.
2.  **Hacks / Workarounds**: Jika Anda terpaksa menulis kode yang "tidak ideal" karena batasan library atau bug eksternal. Jelaskan kenapa!
3.  **TODO & FIXME**: Untuk menandai bagian yang belum selesai atau perlu diperbaiki.
    *   `// TODO: [Nama/Inisial] Deskripsi yang harus dilakukan.`
    *   `// FIXME: Masalah kritis yang perlu segera diperbaiki.`
4.  **Alasan Keputusan (The "Why")**: Kode memberi tahu "How", komentar memberi tahu "Why".

---

## 3. Komentar yang "Buruk" vs "Baik"

❌ **Buruk (Redundant)**:
```javascript
// Update user di database
await User.findByIdAndUpdate(id, data);
```
*Komentar ini tidak berguna karena kodenya sudah jelas.*

✅ **Baik (Memberikan Konteks)**:
```javascript
// Pastikan email tidak diupdate manual untuk mencegah inkonsistensi data OAuth
delete data.email;
await User.findByIdAndUpdate(id, data);
```

---

## 4. Struktur File & Sectioning

Untuk file yang besar (seperti Route atau Controller), gunakan komentar sebagai pemisah (separator).

```javascript
// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post('/login', loginController);
router.post('/register', registerController);
```

---

## 5. Ringkasan Prinsip
- **Singkat dan Jelas**: Jangan menulis esai.
- **Up-to-date**: Jika kode berubah, komentar HARUS diupdate.
- **Gunakan Bahasa Indonesia**: Agar konsisten dengan tim pengembang lokal Sirka (atau Bahasa Inggris jika ingin standar global).

---

## 6. Konteks Arsitektur & Arah Pengembangan

Penting untuk mencantumkan komentar di level file (paling atas) untuk menjelaskan peran file tersebut dalam arsitektur besar Sirka:

- **Frontend (Remix/React)**: Jelaskan jika komponen tersebut adalah *Shared Component*, *Route Handler*, atau *Store Logic*.
- **Backend (Express)**: Jelaskan alur data jika melibatkan beberapa koleksi MongoDB sekaligus.

**Contoh Komentar Header File:**
```javascript
/**
 * ARCHITECTURE ROLE: User Controller
 * File ini menangani logika otentikasi dan manajemen profil.
 * Semua perubahan di sini harus disinkronkan dengan middleware 'auth.js'.
 * 
 * NEXT DEVELOPMENT: Integrasi OAuth2 (Google/FB) akan ditambahkan di sini.
 */
```

---

*Dokumen ini adalah pedoman hidup, silakan diperbarui sesuai kesepakatan tim.*
