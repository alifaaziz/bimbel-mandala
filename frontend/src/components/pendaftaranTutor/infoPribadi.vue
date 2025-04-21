<template>
  <div class="info-pribadi">
    <h2 class="title">Informasi Pribadi</h2>
    <form class="form">
      <!-- Nama Lengkap -->
      <div class="form-group full-width">
        <label for="nama">Nama Lengkap</label>
        <input type="text" id="nama" placeholder="Tuliskan nama Anda disini" />
      </div>

      <!-- Tanggal Lahir -->
      <div class="form-group third-width">
        <label for="tanggal-lahir">Tanggal Lahir</label>
        <div class="input-with-icon">
          <input 
            type="date" 
            id="tanggal-lahir" 
            placeholder="13 Maret 2025" 
          />
          <button type="button" class="calendar-button">
            <i class="icon-calendar"></i>
          </button>
        </div>
      </div>

      <!-- Jenis Kelamin -->
      <div class="form-group third-width">
        <label for="jenis-kelamin">Jenis Kelamin</label>
        <select id="jenis-kelamin">
          <option>Laki-Laki</option>
          <option>Perempuan</option>
        </select>
      </div>

      <!-- Upload Foto -->
      <div class="form-group third-width">
        <label for="foto">Upload Foto</label>
        <div class="input-with-icon">
          <input type="file" id="foto" placeholder="Masukkan foto diri anda" />
          <button type="button" class="upload-button">
            <i class="icon-upload"></i>
          </button>
        </div>
      </div>

      <!-- E-mail -->
      <div class="form-group half-width">
        <label for="email">E-mail</label>
        <input type="email" id="email" placeholder="Tuliskan e-mail anda" />
      </div>

      <!-- No. WhatsApp -->
      <div class="form-group half-width">
        <label for="whatsapp">No. WhatsApp</label>
        <input type="text" id="whatsapp" placeholder="08xx xxxx xxxx" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.info-pribadi {
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #154484;
  margin-bottom: 1.5rem;
  text-align: left; /* Membuat teks rata kiri */
}

.form {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* Enam kolom untuk elemen sejajar */
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 6; /* Membuat elemen ini mengambil seluruh lebar */
}

.form-group.third-width {
  grid-column: span 2; /* Membuat elemen ini mengambil dua kolom (sepertiga) */
}

.form-group.half-width {
  grid-column: span 3; /* Membuat elemen ini mengambil setengah lebar grid */
}

@media (min-width: 768px) {
  .form-group.half-width {
    grid-column: span 3; /* Membuat elemen ini mengambil dua kolom pada layar besar */
  }
}

label {
  font-size: 1rem;
  font-weight: 500;
  color: #154484;
  margin-bottom: 0.5rem;
}

input,
select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  width: 100%; /* Pastikan input mengambil lebar penuh */
  box-sizing: border-box; /* Memastikan padding tidak memengaruhi ukuran */
}

input::placeholder {
  color: #9ca3af;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-right: 3rem; /* Memberikan ruang untuk tombol kalender */
}

.calendar-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #9ca3af;
  padding: 0; /* Menghapus padding default */
  margin: 0; /* Menghapus margin default */
}

.icon-calendar {
  font-size: 1.25rem;
  color: #9ca3af;
}

.upload-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #154484; /* Warna biru untuk ikon unggah */
}

.icon-upload {
  font-size: 1.25rem;
  color: #154484; /* Warna biru untuk ikon unggah */
}

/* Responsif untuk layar kecil */
@media (max-width: 768px) {
  .form {
    grid-template-columns: 1fr; /* Satu kolom untuk layar kecil */
  }
}
</style>