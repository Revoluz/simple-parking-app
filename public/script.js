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
document
  .getElementById("formKeluar")
  .addEventListener("submit", async function (e) {
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
  let dataArr = [];
  // convert array object to array 2d
  for (let i = 0; i < data.length ; i++) {
    dataArr[i] = [];
    dataArr[i][0] = data[i]["Kode Parkir"];
    dataArr[i][1] = data[i]["Plat"];
    dataArr[i][2] = data[i]["Merek"];
    dataArr[i][3] = data[i]["Jenis"];
    dataArr[i][4] = data[i]["Tanggal Masuk"];
  }
  counter(dataArr);
  tampilkanData(dataArr);
}

loadData();
function counter(arr) {
  let counter = 0;
  for (let i = 0; i < arr.length ; i++) {
    if (arr[i][1] == "" || arr[i][1] == undefined) {
      counter++;
    }
  }
  const count = document.getElementById('count');
  count.innerHTML = "Slot Parkir Kosong : "+counter;
}
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
function sortAZ(column, arr) {
  const adaData = arr.filter((item) => item[column] && item[column].trim() !== "");
  const kosong = arr.filter((item) => !item[column] || item[column].trim() === "");
let a;
let b;
  for (let i = 0; i < adaData.length - 1; i++) {
    for (let j = 0; j < adaData.length - i - 1; j++) {
      if(column == 4){
        a = parseInt(Date.parse(adaData[j][column]));
        b =parseInt(Date.parse(adaData[j + 1][column]));
      }else{
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
  arr = adaData.concat(kosong); // gabungkan data isi + kosong concat = gabung array
  tampilkanData(arr);
}

// Bubble Sort Z-A
function sortZA(column, arr) {
  // filter apakah plat ada?
  // trim = delete spasi
  // ex {"Plat : "  "}  = > {"Plat" : ""}
  const adaData = arr.filter(
    (item) => item[column] && item[column].trim() !== "" 
  ); // cek plat tidak kosong
  const kosong = arr.filter(
    (item) => !item[column] || item[column].trim() === "" 
  );

  for (let i = 0; i < adaData.length - 1; i++) {
    for (let j = 0; j < adaData.length - i - 1; j++) {
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
  console.log(kosong);

  arr = adaData.concat(kosong); // gabungkan data isi + kosong concat = gabung array
  tampilkanData(arr);
}

// Tampilkan tabel
function tampilkanData(dataArray) {
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

// Linear Search
// Event pencarian saat diketik
document.getElementById("searchInput").addEventListener("keyup", searchData);

async function searchData() {
  const input = document.getElementById("searchInput").value;
  const keyword = toUpperManual(input.trim());

  if (keyword === "") {
    loadData(); // tampilkan semua data kalau input kosong
    return;
  }

  const res = await fetch("/data");
  const data = await res.json();

  let hasil = [];
  let dataArr = [];
  for (let i = 0; i < data.length; i++) {
    dataArr[i] = [];
    dataArr[i][0] = data[i]["Kode Parkir"];
    dataArr[i][1] = data[i]["Plat"];
    dataArr[i][2] = data[i]["Merek"];
    dataArr[i][3] = data[i]["Jenis"];
    dataArr[i][4] = data[i]["Tanggal Masuk"];
  }
  for (let i = 0; i < data.length; i++) {
    const row = [
      dataArr[i][0],
      dataArr[i][1],
      dataArr[i][2],
      dataArr[i][3],
      dataArr[i][4] ,
    ];

    let ditemukan = false;

    for (let j = 0; j < row.length; j++) {
      let kolom = row[j] || "";
      let kolomUpper = toUpperManual(kolom);

      for (let k = 0; k <= kolomUpper.length - keyword.length; k++) {
        let cocok = true;
        for (let l = 0; l < keyword.length; l++) {
          if (kolomUpper[k + l] !== keyword[l]) {
            cocok = false;
            break;
          }
        }
        if (cocok) {
          ditemukan = true;
          break;
        }
      }

      if (ditemukan) break;
    }

    if (ditemukan) {
      hasil.push(row);
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


document
  .getElementById("sorting")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const urutan = document.getElementById("urutan").value;
    const column = document.getElementById("kolom").value;
    console.log(urutan);
    console.log(column);
    const res = await fetch("/data");
    const data = await res.json();
    let dataArr = [];
    // convert array object to array 2d
    for (let i = 0; i < data.length - 1; i++) {
      dataArr[i] = [];
      dataArr[i][0] = data[i]["Kode Parkir"];
      dataArr[i][1] = data[i]["Plat"];
      dataArr[i][2] = data[i]["Merek"];
      dataArr[i][3] = data[i]["Jenis"];
      dataArr[i][4] = data[i]["Tanggal Masuk"];
    }
    if (urutan == "ASC" ) {
      sortAZ(column, dataArr);
    } else if (urutan == "DESC") {
      sortZA(column, dataArr);
    }
  });
