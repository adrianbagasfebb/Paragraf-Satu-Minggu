# Paragraf Satu Minggu

Website publikasi artikel untuk berbagi cerita, pemikiran, dan pengalaman.

## 1. Teknologi yang Digunakan

- HTML, CSS, dan JavaScript
- Vite sebagai development server
- Supabase sebagai database dan autentikasi admin

## 2. Cara Menjalankan Website

1. Pastikan Node.js sudah terpasang.
2. Buka terminal di folder proyek `paragraf-js`.
3. Jalankan perintah berikut:

   ```bash
   npm install
   npm run dev
   ```

4. Buka alamat yang ditampilkan oleh terminal.

## 3. Alamat Website

- **Halaman publik:** `http://localhost:5173/`
- **Halaman admin:** `http://localhost:5173/admin.html`

Kedua halaman menggunakan server yang sama, tetapi memiliki fungsi berbeda.

## 4. Panduan Admin

1. Buka halaman admin.
2. Masuk menggunakan email dan kata sandi akun admin yang terdaftar di Supabase.
3. Isi judul artikel, kategori, gambar sampul, ringkasan, dan isi artikel.
4. Tentukan status artikel:
   - **Draft:** artikel belum ditampilkan kepada publik.
   - **Terbit:** artikel dapat dibaca melalui halaman publik.
5. Klik tombol simpan untuk menyimpan artikel.
6. Gunakan fitur edit untuk memperbarui artikel dan hapus jika artikel tidak diperlukan lagi.

## 5. Panduan Pengunjung

Pengunjung dapat membuka halaman utama, melihat daftar artikel yang sudah diterbitkan, mencari artikel, memilih kategori, dan membaca artikel secara lengkap.

Pengunjung tidak memerlukan akun untuk membaca artikel yang telah diterbitkan.

## 6. Database dan Keamanan

Database dikelola melalui Supabase. Hak akses artikel diatur menggunakan Row Level Security (RLS). Hanya akun yang terdaftar sebagai admin dan lolos pemeriksaan autentikasi yang boleh mengelola artikel.

Jangan memasukkan password admin atau secret key Supabase ke dalam file README maupun kode frontend.

## 7. Catatan Pengembangan

- Jalankan `npm run dev` sebelum membuka website di localhost.
- Jika server berhenti, jalankan kembali perintah tersebut.
- Jika konfigurasi `.env` diubah, mulai ulang server Vite.
- Alamat localhost hanya dapat diakses melalui komputer yang menjalankan server, kecuali konfigurasi jaringan diubah.
- Untuk penggunaan online, website perlu dideploy ke hosting dan konfigurasi Supabase perlu disesuaikan.

