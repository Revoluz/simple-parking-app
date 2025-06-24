document
  .getElementById("formMasuk")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const plat = document.getElementById("plat-nomor").value;
    const merek = document.getElementById("merek").value;
    const jenisRadio = document.querySelector(
      'input[name="jenisKendaraan"]:checked'
    );
    
    if (!plat || !merek) {
      alert("Plat nomor dan merek kendaraan wajib diisi.");
      return;
    }
    

    const jenis = jenisRadio.value;
    const res = await fetch("/formMasuk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plat, merek, jenis }),
    });

    const data = await res.json();
    document.getElementById("hasil").textContent =
      data.message ;
      loadData();
  });
  document.getElementById("formKeluar").addEventListener("submit",async function (e){
    e.preventDefault();
    const kodeParkir = document.getElementById("Kode").value;
    if(!kodeParkir){
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
  })
  async function loadData() {
    const res = await fetch("/data");
    const data = await res.json();

    const tbody = document.querySelector("#tabelParkir tbody");
    tbody.innerHTML = "";

    data.forEach((row) => {
      const tr = document.createElement("tr");
      Object.values(row).forEach((val) => {
        const td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  loadData();
