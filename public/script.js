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
    if (res.ok) {
      // Sukses
      Swal.fire({
        title: data.message,
        html: `Plat Nomor: <strong>${data.plat}</strong><br>Jenis: <strong>${data.jenis}</strong>`,
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      // Gagal
      document.getElementById("hasil").textContent = data.message;
    }
    loadData();
  });

// Load Data
async function loadData() {
  const res = await fetch("/data");
  const data = await res.json();
  let dataArr = [];
  // convert array object to array 2d
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

loadData();
function counter(arr) {
  let counter = 0;
  // cek dataKosong
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] == "" || arr[i][1] == undefined) {
      counter++;
    }
  }
  const count = document.getElementById("count");
  if(counter == 0){
    count.innerHTML = "Slot Parkir Penuh ";
  }else{
    count.innerHTML = "Slot Parkir Kosong : " + counter;
  }
}
// Uppercase manual
function toUpperManual(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i); // ambilcode ascii
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
  let adaData = [];
  let kosong = [];
  let idxAda = 0;
  let idxKosong = 0;

  // Pisahkan data isi dan kosong secara manual
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][column] && arr[i][column].trim() !== "") {
      adaData[idxAda] = arr[i];
      idxAda++;
    } else {
      kosong[idxKosong] = arr[i];
      idxKosong++;
    }
  }

  let a, b;

  // Bubble Sort pada data yang ada isinya
  for (let i = 0; i < adaData.length - 1; i++) {
    for (let j = 0; j < adaData.length - i - 1; j++) {
      if (column == 4) {
        a = parseInt(Date.parse(adaData[j][column]));
        b = parseInt(Date.parse(adaData[j + 1][column]));
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

  // Gabungkan isi dan kosong secara manual
  let hasil = [];
  for (let i = 0; i < adaData.length; i++) {
    hasil[i] = adaData[i];
  }
  for (let i = 0; i < kosong.length; i++) {
    hasil[adaData.length + i] = kosong[i];
  }

  tampilkanData(hasil);
}

// Bubble Sort Z-A tanpa filter dan concat
function sortZA(column, arr) {
  let adaData = [];
  let kosong = [];
  let idxAda = 0;
  let idxKosong = 0;

  // Pisahkan data isi dan kosong secara manual
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][column] && arr[i][column].trim() !== "") {
      adaData[idxAda] = arr[i];
      idxAda++;
    } else {
      kosong[idxKosong] = arr[i];
      idxKosong++;
    }
  }

  let a, b;
  // Bubble Sort secara menurun (Z-A)
  for (let i = 0; i < adaData.length - 1; i++) {
    for (let j = 0; j < adaData.length - i - 1; j++) {
      if (column == 4) {
        // untuk tgl
        a = parseInt(Date.parse(adaData[j][column]));
        b = parseInt(Date.parse(adaData[j + 1][column]));
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

  // Gabungkan isi dan kosong secara manual
  let hasil = [];
  for (let i = 0; i < adaData.length; i++) {
    hasil[i] = adaData[i];
  }
  for (let i = 0; i < kosong.length; i++) {
    hasil[adaData.length + i] = kosong[i];
  }

  tampilkanData(hasil);
}

// Tampilkan tabel
function tampilkanData(dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i][5] == "1" || dataArray[i][5] == "Terisi") {
      dataArray[i][5] = "Terisi";
    } else {
      dataArray[i][5] = "Kosong";
    }
  }
  const tbody = document.querySelector("#tabelParkir tbody");

  tbody.innerHTML = "";
  // untuk setiao baris
  dataArray.forEach((row) => {
    const tr = document.createElement("tr"); // create elemen baris
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
  let idxHasil = 0;
  let dataArr = [];
  // convert array object to array 2d
  for (let i = 0; i < data.length; i++) {
    dataArr[i] = [];
    dataArr[i][0] = data[i]["Kode Parkir"];
    dataArr[i][1] = data[i]["Plat"];
    dataArr[i][2] = data[i]["Merek"];
    dataArr[i][3] = data[i]["Jenis"];
    dataArr[i][4] = data[i]["Tanggal Masuk"];
    dataArr[i][5] = data[i]["Status"];
  }
  for (let i = 0; i < dataArr.length; i++) {
    if (dataArr[i][5] == "1") {
      dataArr[i][5] = "Terisi";
    } else if (dataArr[i][5] == "0") {
      dataArr[i][5] = "Kosong";
    }
  }
  for (let i = 0; i < data.length; i++) {

    const row = [
      dataArr[i][0],
      dataArr[i][1],
      dataArr[i][2],
      dataArr[i][3],
      dataArr[i][4],
      dataArr[i][5],
    ];

    let ditemukan = false;

    for (let j = 0; j < row.length; j++) {
      let kolom = row[j] || ""; // jika kosong, isi dengan string kosong
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
      // bandingan dengan row satu satu
      hasil[idxHasil] = row;
      idxHasil++;
    }
  }

  if (idxHasil === 0) {
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
    // console.log(urutan);
    // console.log(column);
    const res = await fetch("/data");
    const data = await res.json();
    let dataArr = [];
    // convert array object to array 2d
    for (let i = 0; i < data.length; i++) {
      dataArr[i] = [];
      dataArr[i][0] = data[i]["Kode Parkir"];
      dataArr[i][1] = data[i]["Plat"];
      dataArr[i][2] = data[i]["Merek"];
      dataArr[i][3] = data[i]["Jenis"];
      dataArr[i][4] = data[i]["Tanggal Masuk"];
      dataArr[i][5] = data[i]["Status"];
    }
    if (urutan == "ASC") {
      sortAZ(column, dataArr);
    } else if (urutan == "DESC") {
      sortZA(column, dataArr);
    }
  });
