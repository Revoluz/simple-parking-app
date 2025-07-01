// Form Masuk
document
  .getElementById("formMasuk")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const plat = document.getElementById("plat-nomor").value;
    const merek = document.getElementById("merek").value;
    const jenisRadio = document.querySelector(
      'input[name="jenisKendaraan"]:checked'
    );

    if (!manualTrim(plat) || !manualTrim(merek) || !jenisRadio) {
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
document
  .getElementById("formKeluar")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const kodeParkir = document.getElementById("Kode").value;
    if (!manualTrim(kodeParkir)) {
      alert("Kode parkir wajib diisi.");
      return;
    }

    const res = await fetch("/formKeluar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kodeParkir }),
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        title: data.message,
        html: `Plat Nomor: <strong>${data.plat}</strong><br>Jenis: <strong>${data.jenis}</strong>`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      document.getElementById("hasil").textContent = data.message;
    }
    loadData();
  });

// Load data awal
async function loadData() {
  const res = await fetch("/data");
  const data = await res.json();
  let dataArr = [];

  for (let i = 0; i < data.length; i++) {
    dataArr[i] = [];
    dataArr[i][0] = data[i]["Kode Parkir"];
    dataArr[i][1] = data[i]["Plat"];
    dataArr[i][2] = data[i]["Merek"];
    dataArr[i][3] = data[i]["Jenis"];
    dataArr[i][4] = data[i]["Tanggal Masuk"];
    dataArr[i][5] = data[i]["Status"];
  }

  counter(dataArr);
  tampilkanData(dataArr);
}

// Tampilkan jumlah slot kosong
function counter(arr) {
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] == "" || arr[i][1] == undefined) {
      counter++;
    }
  }
  const count = document.getElementById("count");
  if (counter == 0) {
    count.innerHTML = "Slot Parkir Penuh";
  } else {
    count.innerHTML = "Slot Parkir Kosong : " + counter;
  }
}

// Uppercase manual
function toUpperManual(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code >= 97 && code <= 122) {
      result += String.fromCharCode(code - 32);
    } else {
      result += str[i];
    }
  }
  return result;
}

// Manual trim function
function manualTrim(str) {
  let start = 0;
  let end = str.length - 1;

  while (start <= end && (str[start] === " " || str[start] === "\t")) {
    start++;
  }

  while (end >= start && (str[end] === " " || str[end] === "\t")) {
    end--;
  }

  let hasil = "";
  for (let i = start; i <= end; i++) {
    hasil += str[i];
  }

  return hasil;
}

function sortAZ(column, arr) {
  let adaData = [];
  let kosong = [];
  let idxAda = 0;
  let idxKosong = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][column] && manualTrim(arr[i][column]) !== "") {
      adaData[idxAda++] = arr[i];
    } else {
      kosong[idxKosong++] = arr[i];
    }
  }

  let a, b;
  for (let i = 0; i < idxAda - 1; i++) {
    for (let j = 0; j < idxAda - i - 1; j++) {
      if (column == 4) {
        a = Date.parse(adaData[j][column]);
        b = Date.parse(adaData[j + 1][column]);
      } else {
        a = toUpperManual(adaData[j][column]);
        b = toUpperManual(adaData[j + 1][column]);
      }

      if (a > b) {
        let temp = adaData[j];
        adaData[j] = adaData[j + 1];
        adaData[j + 1] = temp;
      }
    }
  }

  // Gabungkan secara manual
  let hasil = [];
  for (let i = 0; i < idxAda; i++) {
    hasil[i] = adaData[i];
  }
  for (let i = 0; i < idxKosong; i++) {
    hasil[idxAda + i] = kosong[i];
  }

  tampilkanData(hasil);
}

// Bubble Sort Z-A
function sortZA(column, arr) {
  let adaData = [];
  let kosong = [];
  let idxAda = 0;
  let idxKosong = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][column] && manualTrim(arr[i][column]) !== "") {
      adaData[idxAda++] = arr[i];
    } else {
      kosong[idxKosong++] = arr[i];
    }
  }

  let a, b;
  for (let i = 0; i < idxAda - 1; i++) {
    for (let j = 0; j < idxAda - i - 1; j++) {
      if (column == 4) {
        a = Date.parse(adaData[j][column]);
        b = Date.parse(adaData[j + 1][column]);
      } else {
        a = toUpperManual(adaData[j][column]);
        b = toUpperManual(adaData[j + 1][column]);
      }

      if (a < b) {
        let temp = adaData[j];
        adaData[j] = adaData[j + 1];
        adaData[j + 1] = temp;
      }
    }
  }

  // Gabungkan secara manual
  let hasil = [];
  for (let i = 0; i < idxAda; i++) {
    hasil[i] = adaData[i];
  }
  for (let i = 0; i < idxKosong; i++) {
    hasil[idxAda + i] = kosong[i];
  }

  tampilkanData(hasil);
}


// Tampilkan ke tabel
function tampilkanData(dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    dataArray[i][5] = dataArray[i][5] == "1" ? "Terisi" : "Kosong";
  }

  const tbody = document.querySelector("#tabelParkir tbody");
  tbody.innerHTML = "";

  dataArray.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Search
document.getElementById("searchInput").addEventListener("keyup", searchData);

async function searchData() {
  const input = document.getElementById("searchInput").value;
  const keyword = toUpperManual(manualTrim(input));

  if (keyword === "") {
    loadData();
    return;
  }

  const res = await fetch("/data");
  const data = await res.json();

  let hasil = [];
  let idxHasil = 0;

  for (let i = 0; i < data.length; i++) {
    let row = [];
    row[0] = data[i]["Kode Parkir"];
    row[1] = data[i]["Plat"];
    row[2] = data[i]["Merek"];
    row[3] = data[i]["Jenis"];
    row[4] = data[i]["Tanggal Masuk"];
    row[5] = data[i]["Status"] == "1" ? "Terisi" : "Kosong";

    let ditemukan = false;

    for (let j = 0; j < 6; j++) {
      let nilai = toUpperManual(row[j] || "");
      let cocok = true;

      for (let k = 0; k < keyword.length; k++) {
        if (nilai[k] !== keyword[k]) {
          cocok = false;
          break;
        }
      }

      if (cocok) {
        ditemukan = true;
        break;
      }
    }

    if (ditemukan) {
      hasil[idxHasil++] = row;
    }
  }

  if (hasil.length === 0) {
    document.getElementById("hasil").textContent = "Data tidak ditemukan.";
    tampilkanData([]);
  } else {
    document.getElementById("hasil").textContent = "";
    tampilkanData(hasil);
  }
}

// Sorting form submit handler
document
  .getElementById("sorting")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const urutan = document.getElementById("urutan").value;
    const columnValue = document.getElementById("kolom").value;

    if (!urutan || columnValue === "") {
      alert("Silakan pilih kolom dan urutan terlebih dahulu.");
      return;
    }

    const column = parseInt(columnValue);

    const res = await fetch("/data");
    const data = await res.json();

    let dataArr = [];

    for (let i = 0; i < data.length; i++) {
      dataArr[i] = [];
      dataArr[i][0] = data[i]["Kode Parkir"];
      dataArr[i][1] = data[i]["Plat"];
      dataArr[i][2] = data[i]["Merek"];
      dataArr[i][3] = data[i]["Jenis"];
      dataArr[i][4] = data[i]["Tanggal Masuk"];
      dataArr[i][5] = data[i]["Status"];
    }

    if (urutan === "ASC") {
      sortAZ(column, dataArr);
    } else if (urutan === "DESC") {
      sortZA(column, dataArr);
    }
  });

// Panggil load data pertama kali
loadData();
