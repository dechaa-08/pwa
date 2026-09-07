document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     ELEMENT HTML
  ===================================== */

  const noteForm = document.getElementById("noteForm");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");

  const notesContainer = document.getElementById("notesContainer");
  const emptyState = document.getElementById("emptyState");

  const noteCount = document.getElementById("noteCount");
  const searchInput = document.getElementById("searchInput");


  /* =====================================
     DATA CATATAN
  ===================================== */

  let notes = [];

  try {

    const savedNotes =
      localStorage.getItem("cuteNotes");

    if (savedNotes) {

      const parsedNotes =
        JSON.parse(savedNotes);

      if (Array.isArray(parsedNotes)) {

        notes = parsedNotes;

      }

    }

  } catch (error) {

    console.error(
      "Gagal membaca localStorage:",
      error
    );

    notes = [];

  }


  /* =====================================
     SIMPAN DATA
  ===================================== */

  function saveToStorage() {

    try {

      localStorage.setItem(
        "cuteNotes",
        JSON.stringify(notes)
      );

    } catch (error) {

      console.error(
        "Gagal menyimpan catatan:",
        error
      );

    }

  }


  /* =====================================
     FORMAT TANGGAL
  ===================================== */

  function formatDate(date) {

    const result =
      new Date(date);

    if (isNaN(result.getTime())) {

      return "Tanggal tidak diketahui";

    }

    return result.toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  }


  /* =====================================
     UPDATE JUMLAH
  ===================================== */

  function updateCount() {

    const total = notes.length;

    if (total === 0) {

      noteCount.textContent =
        "0 Catatan";

    } else if (total === 1) {

      noteCount.textContent =
        "1 Catatan";

    } else {

      noteCount.textContent =
        `${total} Catatan`;

    }

  }


  /* =====================================
     TAMPILKAN EMPTY STATE
  ===================================== */

  function showEmptyState(messageType = "empty") {

    emptyState.style.display = "block";

    const title =
      emptyState.querySelector("h3");

    const paragraph =
      emptyState.querySelector("p");


    if (messageType === "search") {

      title.textContent =
        "Catatan tidak ditemukan 🔍";

      paragraph.textContent =
        "Coba gunakan kata pencarian lain 💜";

    } else {

      title.textContent =
        "Belum ada catatan";

      paragraph.textContent =
        "Yuk tulis sesuatu yang ingin kamu ingat! ❤️";

    }

  }


  /* =====================================
     RENDER SEMUA CATATAN
  ===================================== */

  function renderNotes(keyword = "") {

    /* Kosongkan container */

    notesContainer.innerHTML = "";


    /* Bersihkan keyword */

    const searchKeyword =
      keyword.trim().toLowerCase();


    /* Filter */

    const filteredNotes =
      notes.filter(note => {

        const title =
          String(note.title || "")
            .toLowerCase();

        const content =
          String(note.content || "")
            .toLowerCase();

        return (
          title.includes(searchKeyword) ||
          content.includes(searchKeyword)
        );

      });


    /* Update jumlah */

    updateCount();


    /* =================================
       JIKA TIDAK ADA CATATAN
    ================================= */

    if (filteredNotes.length === 0) {

      if (searchKeyword !== "") {

        showEmptyState("search");

      } else {

        showEmptyState("empty");

      }

      return;

    }


    /* Sembunyikan empty state */

    emptyState.style.display = "none";


    /* =================================
       BUAT CARD CATATAN
    ================================= */

    filteredNotes.forEach(note => {

      const card =
        document.createElement("article");

      card.className =
        "note-card";


      /* Judul */

      const title =
        document.createElement("h3");

      title.textContent =
        note.title || "Tanpa Judul";


      /* Isi */

      const content =
        document.createElement("p");

      content.textContent =
        note.content || "";


      /* Tanggal */

      const date =
        document.createElement("div");

      date.className =
        "note-date";

      date.textContent =
        `🕒 ${formatDate(note.date)}`;


      /* Tombol hapus */

      const deleteButton =
        document.createElement("button");

      deleteButton.type =
        "button";

      deleteButton.className =
        "delete-btn";

      deleteButton.textContent =
        "🗑️";

      deleteButton.title =
        "Hapus catatan";


      /* Hapus berdasarkan ID */

      deleteButton.addEventListener(
        "click",
        () => {

          deleteNote(note.id);

        }
      );


      /* Masukkan ke card */

      card.appendChild(title);

      card.appendChild(content);

      card.appendChild(date);

      card.appendChild(deleteButton);


      /* Masukkan card ke container */

      notesContainer.appendChild(card);

    });

  }


  /* =====================================
     TAMBAH CATATAN
  ===================================== */

  noteForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      /* Ambil nilai */

      const title =
        noteTitle.value.trim();

      const content =
        noteContent.value.trim();


      /* Validasi */

      if (title === "") {

        alert(
          "Judul catatan belum diisi 💜"
        );

        noteTitle.focus();

        return;

      }


      if (content === "") {

        alert(
          "Isi catatan belum diisi 📝"
        );

        noteContent.focus();

        return;

      }


      /* Buat catatan baru */

      const newNote = {

        id:
          Date.now() +
          Math.floor(Math.random() * 1000),

        title:
          title,

        content:
          content,

        date:
          new Date().toISOString()

      };


      /* Tambahkan ke awal */

      notes.unshift(newNote);


      /* Simpan */

      saveToStorage();


      /* Tampilkan */

      renderNotes();


      /* Kosongkan form */

      noteForm.reset();


      /* Fokus */

      noteTitle.focus();


      /* Scroll ke daftar */

      setTimeout(() => {

        const notesSection =
          document.querySelector(
            ".notes-section"
          );

        if (notesSection) {

          notesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }, 150);

    }
  );


  /* =====================================
     HAPUS CATATAN
  ===================================== */

  function deleteNote(id) {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus catatan ini? 🥺"
      );


    if (!confirmDelete) {

      return;

    }


    notes =
      notes.filter(
        note => note.id !== id
      );


    saveToStorage();


    renderNotes(
      searchInput.value
    );

  }


  /* =====================================
     SEARCH
  ===================================== */

  searchInput.addEventListener(
    "input",
    () => {

      renderNotes(
        searchInput.value
      );

    }
  );


  /* =====================================
     TAMPILKAN SAAT HALAMAN DIBUKA
  ===================================== */

  renderNotes();


});
