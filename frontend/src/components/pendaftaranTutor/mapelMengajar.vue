<template>
  <div class="mengajar">
    <h2 class="title">Mengajar</h2>
    <form class="form">
      <!-- Jenjang -->
      <div class="form-group">
        <label for="jenjang">Jenjang</label>
        <input type="text" id="jenjang" placeholder="SMP, SMA" />
      </div>

      <!-- Mata Pelajaran -->
      <div class="form-group">
        <label for="mapel">Mata Pelajaran</label>
        <input type="text" id="mapel" placeholder="Matematika, Fisika, Kimia" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.mengajar {
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
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 1rem;
  font-weight: 500;
  color: #154484;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

input::placeholder {
  color: #9ca3af;
}
</style>