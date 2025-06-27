let currentData = [];

// Form Masuk
document.getElementById("formMasuk").addEventListener("submit", async function (e) {
  e.preventDefault();
  const plat = document.getElementById("plat-nomor").value;
  const merek = document.getElementById("merek").value;
  const jenisRadio = document.querySelector('input[name="jenisKendaraan"]:checked');

  if (!plat || !merek || !jenisRadio) {
    alert("Plat nomor, merek, dan jenis kendaraan wajib diisi.");
    return;
  }

  const jenis = jenisRadio.value;
  const res = await fetch("/formMasuk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plat, merek, jenis }),
  });

  const data = await res.json();
  document.getElementById("hasil").textContent = data.message;
  loadData();
});

// Form Keluar
document.getElementById("formKeluar").addEventListener("submit", async function (e) {
  e.preventDefault();
  const kodeParkir = document.getElementById("Kode").value;
  if (!kodeParkir) {
    alert("Kode parkir wajib diisi.");
    return;
  }
  const res = await fetch("/formKeluar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kodeParkir }),
  });
  const data = await res.json();
  document.getElementById("hasil").textContent = data.message;
  loadData();
});

// Load Data
async function loadData() {
  const res = await fetch("/data");
  const data = await res.json();
  currentData = data;
  tampilkanData(currentData);
}

loadData();

// Uppercase manual
function toUpperManual(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    // convert to UpperCase ASCII besar = kecil - 32 
    if (code >= 97 && code <= 122) {
      result += String.fromCharCode(code - 32);
    } else {
      result += str[i];
    }
  }
  return result;
}

// Bubble Sort A-Z
function sortAZ() {
  const adaData = currentData.filter(item => item["Plat"] && item["Plat"].trim() !== "");
  const kosong = currentData.filter(item => !item["Plat"] || item["Plat"].trim() === "");

  for (let i = 0; i < adaData.length - 1; i++) {
    for (let j = 0; j < adaData.length - i - 1; j++) {
      let a = toUpperManual(adaData[j]["Plat"]);
      let b = toUpperManual(adaData[j + 1]["Plat"]);
      if (a > b) {
        let temp = adaData[j];
        adaData[j] = adaData[j + 1];
        adaData[j + 1] = temp;
      }
    }
  }

  currentData = adaData.concat(kosong); // gabungkan data isi + kosong concat = gabung array
  tampilkanData(currentData);
}

// Bubble Sort Z-A
function sortZA() {
  // filter apakah plat ada?
  // trim = delete spasi
  // ex {"Plat : "  "}  = > {"Plat" : ""}
  const adaData = currentData.filter(item => item["Plat"] && item["Plat"].trim() !== ""); // cek plat tidak kosong
  const kosong = currentData.filter(item => !item["Plat"] || item["Plat"].trim() === "");

  for (let i = 0; i < adaData.length - 1; i++) {
    for (let j = 0; j < adaData.length - i - 1; j++) {
      let a = toUpperManual(adaData[j]["Plat"]);
      let b = toUpperManual(adaData[j + 1]["Plat"]);
      if (a < b) {
        let temp = adaData[j];
        adaData[j] = adaData[j + 1];
        adaData[j + 1] = temp;
      }
    }
  }

  currentData = adaData.concat(kosong); // gabungkan data isi + kosong
  tampilkanData(currentData);
}


// Tampilkan tabel
function tampilkanData(dataArray) {
  const tbody = document.querySelector("#tabelParkir tbody");
  tbody.innerHTML = "";
  dataArray.forEach((row) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Binary Search
function searchData() {
  const keyword = toUpperManual(document.getElementById("searchInput").value.trim());
  if (!keyword) {
    alert("Masukkan plat nomor yang dicari.");
    return;
  }

  // Ambil hanya data yang tidak kosong
  const dataValid = currentData.filter(item => item["Plat"] && item["Plat"].trim() !== "");

  // Sorting A-Z (Bubble Sort)
  for (let i = 0; i < dataValid.length - 1; i++) {
    for (let j = 0; j < dataValid.length - i - 1; j++) {
      let a = toUpperManual(dataValid[j]["Plat"]);
      let b = toUpperManual(dataValid[j + 1]["Plat"]);
      if (a > b) {
        let temp = dataValid[j];
        dataValid[j] = dataValid[j + 1];
        dataValid[j + 1] = temp;
      }
    }
  }

  // Binary Search
  let low = 0;
  let high = dataValid.length - 1;
  let found = false;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let midVal = toUpperManual(dataValid[mid]["Plat"]);

    if (midVal === keyword) {
      tampilkanData([dataValid[mid]]);
      document.getElementById("hasil").textContent = "";
      found = true;
      break;
    } else if (midVal < keyword) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (!found) {
    document.getElementById("hasil").textContent = "Data tidak ditemukan.";
    tampilkanData([]);
  }
}
