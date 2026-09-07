let catatan = JSON.parse(
    localStorage.getItem("catatan")
) || [];


function simpanCatatan() {

    let judul = document.getElementById("judul").value;
    let isi = document.getElementById("isi").value;

    if (judul === "" || isi === "") {

        alert("Judul dan isi catatan harus diisi!");

        return;
    }


    let data = {

        id: Date.now(),

        judul: judul,

        isi: isi

    };


    catatan.push(data);


    localStorage.setItem(
        "catatan",
        JSON.stringify(catatan)
    );


    document.getElementById("judul").value = "";

    document.getElementById("isi").value = "";


    tampilkanCatatan();
}


function tampilkanCatatan() {

    let daftar =
        document.getElementById("daftarCatatan");


    daftar.innerHTML = "";


    catatan.forEach(function(data) {

        daftar.innerHTML += `

            <div class="catatan">

                <h3>
                    ${data.judul}
                </h3>

                <p>
                    ${data.isi}
                </p>

                <button
                    class="hapus"
                    onclick="hapusCatatan(${data.id})">

                    Hapus

                </button>

            </div>

        `;

    });
}


function hapusCatatan(id) {

    catatan = catatan.filter(
        function(data) {

            return data.id !== id;

        }
    );


    localStorage.setItem(
        "catatan",
        JSON.stringify(catatan)
    );


    tampilkanCatatan();
}


tampilkanCatatan();


// Registrasi Service Worker

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("service-worker.js")

        .then(function() {

            console.log(
                "Service Worker berhasil dijalankan"
            );

        })

        .catch(function(error) {

            console.log(
                "Service Worker gagal:",
                error
            );

        });

}
