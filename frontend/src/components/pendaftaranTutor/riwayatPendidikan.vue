<template>
  <div class="pendidikan">
    <h2 class="title">Pendidikan</h2>
    <form class="form">
      <!-- Asal Universitas -->
      <div class="form-group full-width">
        <label for="universitas">Asal Universitas</label>
        <input type="text" id="universitas" placeholder="Tuliskan asal universitas" />
      </div>

      <!-- Prodi -->
      <div class="form-group half-width">
        <label for="prodi">Program Studi</label>
        <input type="text" id="prodi" placeholder="Tuliskan Program Studi Anda" />
      </div>

      <!-- Status -->
      <div class="form-group half-width">
        <label for="status">Status</label>
        <select id="status">
          <option>Sarjana S1</option>
          <option>Diploma D3</option>
          <option>Magister S2</option>
          <option>Doktor S3</option>
        </select>
      </div>
    </form>
  </div>
</template>

<style scoped>
.pendidikan {
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
  grid-template-columns: repeat(2, 1fr); /* Dua kolom untuk elemen sejajar */
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2; /* Membuat elemen ini mengambil seluruh lebar */
}

.form-group.half-width {
  grid-column: span 1; /* Membuat elemen ini mengambil setengah lebar */
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

@media (max-width: 768px) {
  .form {
    grid-template-columns: 1fr; /* Satu kolom untuk layar kecil */
  }
}
</style>