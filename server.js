const express = require("express"); // library frameworkmuntuk node.js buat server
const bodyParser = require("body-parser"); // ambil data json or form yang dikirim
const XLSX = require("xlsx"); //libaray excell
const fs = require("fs"); //filesystem untnuk  cek
const path = require("path"); // mengelola file for all os
const app = express(); //aplikasi express save to app
const PORT = 3000; // tempat server berjalan

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // membaca memprises body dlm format json
app.use(express.static("public")); //req -> cari ke folder public

// Endpoint menerima data parkir
app.post("/formMasuk", (req, res) => {
  const { plat, merek, jenis } = req.body; // mengambil nilai
  const waktuMasuk = formatDateTime(new Date()); // waktu saat ini
  const filePath = path.join(__dirname, "data", "parkir.xlsx"); //cari folder data > parkir.xlsx
  let workbook; //file excell skrg
  let worksheet; // halaman pertama (aktif) file excell
  let slotKosong = null; //baris 0 pertama to kendaraan baru

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);

    worksheet = workbook.Sheets[workbook.SheetNames[0]]; // nama sheet 1 ambil datanya
    const jsonData = XLSX.utils.sheet_to_json(worksheet); // ubah jdi array of object
  for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i]["Plat"] == undefined ||jsonData[i]["Plat"] == "") {
        slotKosong = jsonData[i];
        break;
      }
    }

    if (slotKosong) {
      // isi data baris koosng pertama
      slotKosong["Plat"] = plat;
      slotKosong["Merek"] = merek;
      slotKosong["Jenis"] = jenis;
      slotKosong["Tanggal Masuk"] = waktuMasuk;
      slotKosong["Status"] = "1";
    } else {
      return res.status(400).json({ message: "Semua slot penuh!" });
    }

    // setelah diisi Konversi kembali ke worksheet
    const updatedSheet = XLSX.utils.json_to_sheet(jsonData, {
      header: Object.keys(slotKosong), // ambil header
    });
    workbook.Sheets[workbook.SheetNames[0]] = updatedSheet; //ganti isi
  } else {
    return res.json({ message: "Data parkir tidak Ada!" });
  }
  XLSX.writeFile(workbook, filePath); // tulis
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

    for (let i = 0; i < jsonData.length; i++) {
      if (
        jsonData[i]["Kode Parkir"] == kodeParkir &&
        jsonData[i]["Status"] == "1"
      ) {
        slotHapus = jsonData[i];
        break;
      }
    }

    if (slotHapus) {
      var platNomor = slotHapus["Plat"];
      var jenis = slotHapus["Jenis"];
      slotHapus["Plat"] = "";
      slotHapus["Merek"] = "";
      slotHapus["Jenis"] = "";
      slotHapus["Tanggal Masuk"] = "";
      slotHapus["Status"] = "0";
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
  return res.status(200).json({
    plat: platNomor,
    jenis: jenis,
    message: "Kendaraan keluar",
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
