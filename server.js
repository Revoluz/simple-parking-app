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
  let slotKosong = null;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
  for (let i = 0; i < jsonData.length - 1; i++) {
      if (jsonData[i]["Plat"] == undefined ||jsonData[i]["Plat"] == "") {
        slotKosong = jsonData[i];
        break;
      }
    }

    if (slotKosong) {
      slotKosong["Plat"] = plat;
      slotKosong["Merek"] = merek;
      slotKosong["Jenis"] = jenis;
      slotKosong["Tanggal Masuk"] = waktuMasuk;
    } else {
      return res.status(400).json({ message: "Semua slot penuh!" });
    }

    // Konversi kembali ke worksheet
    const updatedSheet = XLSX.utils.json_to_sheet(jsonData, {
      header: Object.keys(slotKosong),
    });
    workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
  } else {
    return res.json({ message: "Data parkir tidak Ada!" });
  }
  XLSX.writeFile(workbook, filePath);
  return res.json({
    message: `Parkir berhasil. Slot: ${slotKosong["Kode Parkir"]}`,
  });
});
app.post("/formKeluar", (req, res) => {
  const { kodeParkir } = req.body;
  const filePath = path.join(__dirname, "data", "parkir.xlsx");
  let workbook;
  let worksheet;
  let slotHapus = null;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);


    for (let i = 0; i < jsonData.length - 1; i++) {
      if ((jsonData[i]["Kode Parkir"] == kodeParkir)&&(jsonData[i]["Plat"] !="")) {
        slotHapus = jsonData[i];
        break;
      }
    }
    if (slotHapus) {
      slotHapus["Plat"] = "";
      slotHapus["Merek"] = "";
      slotHapus["Jenis"] = "";
      slotHapus["Tanggal Masuk"] = "";
    } else {
      return res.status(400).json({ message: "Slot Parkir Kosong!" });
    }

    // Konversi kembali ke worksheet
    const updatedSheet = XLSX.utils.json_to_sheet(jsonData, {
      header: Object.keys(slotHapus),
    });
    workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
  } else {
    return res.json({ message: "Data parkir tidak Ada!" });
  }
  XLSX.writeFile(workbook, filePath);
  return res.json({
    message: `Parkir berhasil dihapus. Slot: ${slotHapus["Kode Parkir"]}`,
  });
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
