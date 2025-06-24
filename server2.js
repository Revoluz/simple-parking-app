const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Endpoint menerima data parkir
app.post("/formMasuk", (req, res) => {
    const { plat, merek, jenis } = req.body;
    const waktuMasuk = formatDateTime(new Date()); // waktu saat ini

  const filePath = path.join(__dirname, "data", "parkir.xlsx");

  let workbook;
  let worksheet;
  let dataBaru = [];
  let kodeBaru = "KP001";

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    if (jsonData.length > 0) {
      const lastKode = jsonData[jsonData.length - 1]["Kode"];
      const nomorBaru = parseInt(lastKode.slice(2)) + 1;
      kodeBaru = "KP" + String(nomorBaru).padStart(3, "0");
    }

    dataBaru = [[kodeBaru, plat, jenis, merek, waktuMasuk]];
    XLSX.utils.sheet_add_aoa(worksheet, dataBaru, { origin: -1 }); // append
  } else {
    dataBaru = [["KP001", plat, jenis, merek, waktuMasuk]];
    worksheet = XLSX.utils.aoa_to_sheet([
      ["Kode", "Plat", "Jenis", "Merk", "Tanggal Masuk"],
      ...dataBaru,
    ]);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parkir");
  }
  XLSX.writeFile(workbook, filePath);
  res.json({ message: "Data parkir tersimpan!", kodeBaru });
});

app.get("/data", (req, res) => {
  const filePath = path.join(__dirname, "data", "parkir.xlsx");

  if (!fs.existsSync(filePath)) return res.json([]);

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  res.json(jsonData);
});
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

function formatDateTime(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
  