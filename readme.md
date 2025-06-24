


## 🧰 Teknologi

- Node.js v20.19.3
- Express.js
- xlsx (library Excel untuk Node.js)
- HTML + JavaScript (frontend)
- Bootstrap (untuk tampilan)
- Disimpan dalam file `parkir.xlsx`

---

## 📦 Fitur

- Menambahkan kendaraan masuk
- Menandai kendaraan keluar
- Kode parkir tetap dari `KP001` s.d. `KP020` (20 slot)
- Menyimpan ke Excel (bisa dibuka pakai Microsoft Excel)
- Menampilkan data parkir ke halaman web
- Auto format tanggal dan waktu masuk/keluar

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd simple-parking-app
````

### 2. Install Dependensi

```bash
npm install
```

### 3. Buat Folder Data dan File Awal

```bash
node generateParkir.js
```

> Ini akan membuat `data/parkir.xlsx` dengan 20 slot kosong.

### 4. Jalankan Server

```bash
nodemon server.js
```

Atau jika tidak pakai nodemon:

```bash
node server.js
```

---

## 🌐 Akses Website

Buka di browser:

```
http://localhost:3000
```

---

## 📝 Struktur File

```
simple-parking-app/
├── public/
│   ├── index.html      # halaman utama
│   ├── script.js       # logic client-side
├── data/
│   └── parkir.xlsx     # file Excel yang menyimpan data parkir
├── server.js           # server utama Node.js
├── generateParkir.js   # script untuk membuat file Excel awal
├── package.json
└── README.md
```

---

## 🛠 API

### `POST /formMasuk`

> Tambahkan kendaraan masuk ke slot kosong.

**Body (JSON):**

```json
{
  "plat": "AB1234CD",
  "merek": "Honda",
  "jenis": "Motor"
}
```

---

### `POST /keluar`

> Tandai kendaraan keluar berdasarkan plat.

**Body (JSON):**

```json
{
  "plat": "AB1234CD"
}
```

---

