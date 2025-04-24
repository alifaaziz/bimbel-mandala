<template>
  <div class="container-form">
    <!-- sfc2: Header Tutor -->
    <div class="header-tutor">
      <h1 class="title title-header">Selamat Datang <br /> Calon Tutor Mandala</h1>
      <p class="subtitle">
        Silahkan mendaftar dan menjadi bagian dari Bimbel Mandala untuk memberikan
        pengetahuan ke lebih banyak siswa.
      </p>
    </div>

    <!-- sfc3: Informasi Pribadi -->
    <div class="info-pribadi">
      <h2 class="title">Informasi Pribadi</h2>
      <form class="form">
        <div class="form-group full-width">
          <label for="nama">Nama Lengkap</label>
          <input type="text" id="nama" placeholder="Tuliskan nama Anda disini" v-model="formData.nama" />
        </div>

        <div class="form-group third-width">
          <label for="tanggal-lahir">Tanggal Lahir</label>
          <div class="input-with-icon">
            <input type="date" id="tanggal-lahir" v-model="formData.tanggalLahir" />
            <button type="button" class="calendar-button">
              <i class="icon-calendar"></i>
            </button>
          </div>
        </div>

        <div class="form-group third-width">
          <label for="jenis-kelamin">Jenis Kelamin</label>
          <select id="jenis-kelamin" v-model="formData.jenisKelamin">
            <option>Laki-Laki</option>
            <option>Perempuan</option>
          </select>
        </div>

        <div class="form-group third-width">
          <label for="foto">Upload Foto</label>
          <div class="input-with-icon">
            <input type="file" id="foto" @change="e => formData.foto = e.target.files[0]" />
            <button type="button" class="upload-button">
              <i class="icon-upload"></i>
            </button>
          </div>
        </div>

        <div class="form-group half-width">
          <label for="email">E-mail</label>
          <input type="email" id="email" placeholder="Tuliskan e-mail anda" v-model="formData.email" />
        </div>

        <div class="form-group half-width">
          <label for="whatsapp">No. WhatsApp</label>
          <input type="text" id="whatsapp" placeholder="08xx xxxx xxxx" v-model="formData.whatsapp" />
        </div>
      </form>
    </div>

    <!-- sfc5: Pendidikan -->
    <div class="pendidikan">
      <h2 class="title">Pendidikan</h2>
      <form class="form">
        <div class="form-group full-width">
          <label for="universitas">Asal Universitas</label>
          <input type="text" id="universitas" placeholder="Tuliskan asal universitas" v-model="formData.universitas" />
        </div>

        <div class="form-group half-width">
          <label for="prodi">Program Studi</label>
          <input type="text" id="prodi" placeholder="Tuliskan Program Studi Anda" v-model="formData.prodi" />
        </div>

        <div class="form-group half-width">
          <label for="status">Status</label>
          <select id="status" v-model="formData.status">
            <option>Sarjana S1</option>
            <option>Diploma D3</option>
            <option>Magister S2</option>
            <option>Doktor S3</option>
          </select>
        </div>
      </form>
    </div>

    <!-- sfc4: Mengajar -->
    <div class="mengajar">
      <h2 class="title">Mengajar</h2>
      <form class="form">
        <div class="form-group half-width">
          <label for="jenjang">Jenjang</label>
          <input type="text" id="jenjang" placeholder="SMP, SMA" v-model="formData.jenjang" />
        </div>

        <div class="form-group half-width">
          <label for="mapel">Mata Pelajaran</label>
          <input type="text" id="mapel" placeholder="Matematika, Fisika, Kimia" v-model="formData.mapel" />
        </div>
      </form>
    </div>

    <!-- sfc1: Hari Mengajar -->
    <div class="hari-mengajar">
      <h2 class="title">Hari aktif</h2>
      <div class="days">
        <button
          v-for="(day, index) in days"
          :key="index"
          :class="['day-button', { active: selectedDays.includes(day) }]"
          @click="toggleDay(day)"
        >
          {{ day }}
        </button>
      </div>
    </div>
    <!-- Tombol Submit -->
    <n-button
      class="submit-button"
      type="primary"
      size="large"
      @click="submitForm"
    >
      Submit
    </n-button>
  </div>
</template>

<script>
import { NButton } from 'naive-ui';

export default {
  components: {
    NButton,
  },
  data() {
    return {
      days: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"],
      selectedDays: [],
      formData: {
        nama: "",
        tanggalLahir: "",
        jenisKelamin: "",
        foto: null,
        email: "",
        whatsapp: "",
        universitas: "",
        prodi: "",
        status: "",
        jenjang: "",
        mapel: "",
      },
    };
  },
  methods: {
    toggleDay(day) {
      if (this.selectedDays.includes(day)) {
        this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
        this.selectedDays.push(day);
      }
    },
    submitForm() {
      const data = {
        ...this.formData,
        hariAktif: this.selectedDays,
      };

      // Format pesan untuk WhatsApp
      const message = `
        *Pendaftaran Tutor Bimbel Mandala*\n\n
        Berikut adalah data pendaftaran calon tutor:\n
        - *Nama Lengkap*: ${data.nama}\n
        - *Tanggal Lahir*: ${data.tanggalLahir}\n
        - *Jenis Kelamin*: ${data.jenisKelamin}\n
        - *Email*: ${data.email}\n
        - *Nomor WhatsApp*: ${data.whatsapp}\n
        - *Asal Universitas*: ${data.universitas}\n
        - *Program Studi*: ${data.prodi}\n
        - *Status Pendidikan*: ${data.status}\n
        - *Jenjang yang Diajarkan*: ${data.jenjang}\n
        - *Mata Pelajaran*: ${data.mapel}\n
        - *Hari Aktif Mengajar*: ${data.hariAktif.join(", ")}\n\n
        Mohon untuk segera memproses data ini. Terima kasih.
      `;

      // Encode pesan untuk URL
      const encodedMessage = encodeURIComponent(message);

      // Nomor WhatsApp tujuan (ganti dengan nomor yang sesuai)
      const whatsappNumber = "6285855852485";

      // Redirect ke WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    },
  },
};
</script>

<style scoped>
/* Global */
* {
  box-sizing: border-box;
}

.container-form {
  padding: 0 8rem;
}

form {
  margin-bottom: 3rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #154484;
  text-align: left;
}

.title-header {
  font-size: 4rem;
  line-height: 1.2;
  text-align: center;
}

.subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: #f27f28;
  text-align: center;
}

/* Layout untuk header */
.header-tutor {
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
}

/* Info Pribadi, Pendidikan, Mengajar, Hari Mengajar */
.info-pribadi,
.pendidikan,
.mengajar,
.hari-mengajar {
  font-family: 'Poppins', sans-serif;
}

/* Form */
.form {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 6;
}

.form-group.third-width {
  grid-column: span 2;
}

.form-group.half-width {
  grid-column: span 3;
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
  width: 100%;
}

input::placeholder {
  color: #9ca3af;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-right: 3rem;
}

.calendar-button,
.upload-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #154484;
}

/* Hari Aktif */
.days {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.day-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #154484;
  border-radius: 20px;
  background-color: white;
  color: #154484;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-button.active,
.day-button:hover {
  background-color: #154484;
  color: white;
}

/* Tambahkan styling untuk tombol submit */
.submit-button {
  font-family: 'Poppins', sans-serif;
  background-color: #154484 !important;
  color: white;
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #123a6d;
}

/* Responsive */
@media (max-width: 960px) {
  .container-form {
      padding: 0 2rem;
  }
  .form {
    grid-template-columns: 1fr;
  }

  .form-group.full-width,
  .form-group.third-width,
  .form-group.half-width {
    grid-column: span 1;
  }

  input,
  select {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .calendar-button,
  .upload-button {
    font-size: 1rem;
  }
}
</style>
