const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Buat 20 slot dengan kode parkir tetap KP001 - KP020
const data = [
  ["Kode Parkir", "Plat", "Merek", "Jenis", "Tanggal Masuk"],
];

for (let i = 1; i <= 20; i++) {
  const kode = "KP" + String(i).padStart(3, "0");
  data.push([kode, "", "", "", "", ""]); // slot kosong
}

// Buat sheet dan workbook
const worksheet = XLSX.utils.aoa_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Parkir");

// Simpan ke file
const folderPath = path.join(__dirname, "data");
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}
const filePath = path.join(folderPath, "parkir.xlsx");
XLSX.writeFile(workbook, filePath);

console.log("File parkir.xlsx berhasil dibuat dengan 20 slot kosong.");
