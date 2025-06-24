Berikut adalah contoh `README.md` sederhana dan informatif untuk proyek **Sistem Parkir Sederhana** menggunakan **Node.js v20.19.3**, Express, dan Excel (`xlsx`) sebagai penyimpanan:

---

```markdown
# 🚗 Sistem Parkir Sederhana (Node.js + Excel)

Sistem parkir berbasis web sederhana yang dibangun dengan **Node.js v20.19.3**. Data parkir disimpan dalam file **Excel (`parkir.xlsx`)** sebagai alternatif dari database.

---

## 🛠 Teknologi yang Digunakan

- **Node.js v20.19.3**
- **Express.js**
- **xlsx** (untuk membaca & menulis file Excel)
- **HTML + JavaScript** (frontend)
- **Bootstrap** (UI)

---

## 📁 Struktur Folder

```

simple-parking-app/
├── data/
│   └── parkir.xlsx         # File Excel untuk data parkir
├── public/
│   ├── index.html          # Halaman utama
│   └── script.js           # JavaScript frontend
├── server.js               # Server Node.js
├── generateParkir.js       # Generate 20 slot awal
└── README.md               # Dokumentasi ini

````

---

## ✅ Fitur

- Tambah data parkir (Masuk)
- Keluar kendaraan dan update waktu keluar
- Sistem slot tetap (`KP001` hingga `KP020`)
- Menyimpan data ke Excel (tanpa database)
- Menampilkan data ke tabel HTML

---

## 🚀 Cara Menjalankan

### 1. Clone Repo (atau buat folder baru)
```bash
git clone <repo-url>
cd simple-parking-app
````

### 2. Install Dependency

```bash
npm install
```

### 3. Buat file Excel dengan 20 slot kosong

```bash
node generateParkir.js
```

### 4. Jalankan Server

```bash
node server.js
# atau jika pakai nodemon:
# nodemon server.js
```

### 5. Buka di Browser

```
http://localhost:3000
```

---

## 📄 API Endpoint

### POST `/formMasuk`

Menambahkan kendaraan masuk ke slot kosong.

```json
{
  "plat": "AB1234CD",
  "merek": "Honda",
  "jenis": "Motor"
}
```

### POST `/keluar`

Mengisi kolom tanggal keluar berdasarkan plat.

```json
{
  "plat": "AB1234CD"
}
```

---

## 📦 Dependency

```bash
npm install express body-parser xlsx
```

Opsional (development):

```bash
npm install -g nodemon
```




