let catatan = JSON.parse(
localStorage.getItem("catatan")
) || [];

/* =========================
SIMPAN CATATAN
========================= */

function simpanCatatan() {

const judulInput = document.getElementById("judul");
const isiInput = document.getElementById("isi");

const judul = judulInput.value.trim();
const isi = isiInput.value.trim();

/* Cek input */
if (judul === "" || isi === "") {

    tampilkanNotifikasi(
        "💗 Judul dan isi catatan harus diisi!"
    );

    return;
}

/* Buat data catatan */
const data = {
    id: Date.now(),
    judul: judul,
    isi: isi
};

/* Masukkan ke array */
catatan.push(data);

/* Simpan ke localStorage */
localStorage.setItem(
    "catatan",
    JSON.stringify(catatan)
);

/* Kosongkan form */
judulInput.value = "";
isiInput.value = "";

/* Tampilkan catatan */
tampilkanCatatan();

/* Notifikasi */
tampilkanNotifikasi(
    "💜 Catatan berhasil disimpan! ✨"
);


}

/* =========================
TAMPILKAN CATATAN
========================= */

function tampilkanCatatan() {

const daftar =
    document.getElementById("daftarCatatan");

daftar.innerHTML = "";

/* Jika belum ada catatan */
if (catatan.length === 0) {

    daftar.innerHTML = `
        <div class="catatan-kosong">
            <div class="empty-icon">📝</div>

            <h3>Belum ada catatan</h3>

            <p>
                Yuk tulis sesuatu yang ingin kamu ingat! 💕
            </p>
        </div>
    `;

    return;
}

/* Tampilkan semua catatan */
catatan.forEach(function(data) {

    const card = document.createElement("div");

    card.className = "catatan";

    card.innerHTML = `
        <h3>${escapeHTML(data.judul)}</h3>

        <p>${escapeHTML(data.isi)}</p>

        <button
            class="hapus"
            onclick="hapusCatatan(${data.id})">

            🗑️ Hapus

        </button>
    `;

    daftar.appendChild(card);
});


}

/* =========================
HAPUS CATATAN
========================= */

function hapusCatatan(id) {

const yakin = confirm(
    "💗 Yakin ingin menghapus catatan ini?"
);

if (!yakin) {
    return;
}

catatan = catatan.filter(
    function(data) {
        return data.id !== id;
    }
);

/* Update localStorage */
localStorage.setItem(
    "catatan",
    JSON.stringify(catatan)
);

/* Tampilkan ulang */
tampilkanCatatan();

tampilkanNotifikasi(
    "🗑️ Catatan berhasil dihapus!"
);


}

/* =========================
NOTIFIKASI
========================= */

function tampilkanNotifikasi(pesan) {

/* Hapus notifikasi lama */
const notifikasiLama =
    document.querySelector(".notifikasi");

if (notifikasiLama) {
    notifikasiLama.remove();
}

/* Buat notifikasi */
const notifikasi =
    document.createElement("div");

notifikasi.className = "notifikasi";

notifikasi.textContent = pesan;

document.body.appendChild(notifikasi);

/* Animasi masuk */
setTimeout(function() {
    notifikasi.classList.add("tampil");
}, 10);

/* Hapus setelah beberapa detik */
setTimeout(function() {

    notifikasi.classList.remove("tampil");

    setTimeout(function() {
        notifikasi.remove();
    }, 400);

}, 2500);


}

/* =========================
KEAMANAN TEKS
========================= */

function escapeHTML(teks) {

return teks
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


}

/* =========================
SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {

window.addEventListener(
    "load",
    function() {

        navigator.serviceWorker
            .register("./service-worker.js")

            .then(function() {

                console.log(
                    "💜 Service Worker berhasil dijalankan"
                );

            })

            .catch(function(error) {

                console.log(
                    "Service Worker gagal:",
                    error
                );

            });
    }
);


}

/* =========================
JALANKAN SAAT HALAMAN DIBUKA
========================= */

tampilkanCatatan();
