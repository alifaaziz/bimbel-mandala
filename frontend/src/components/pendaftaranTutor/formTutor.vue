<script>
import { NButton } from 'naive-ui';
import butPrimerHuge from '../dirButton/butPrimerHuge.vue';
import butSecondHuge from '../dirButton/butSecondHuge.vue';

export default {
  components: {
    NButton,
    butPrimerHuge,
    butSecondHuge,
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
        deskripsi: "",
      },
      isSubmitting: false, // Untuk mencegah pengiriman ganda
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
    async submitForm() {
      if (this.isSubmitting) return; // Cegah pengiriman ganda
      this.isSubmitting = true;

      try {
        // Validasi data
        if (!this.formData.nama || !this.formData.email || !this.formData.tanggalLahir || !this.formData.jenisKelamin || !this.formData.foto) {
          alert("Harap lengkapi semua data yang wajib diisi.");
          this.isSubmitting = false;
          return;
        }

        // Buat payload
        const payload = new FormData();
        payload.append("name", this.formData.nama);
        payload.append("email", this.formData.email);
        payload.append("birthDate", new Date(this.formData.tanggalLahir).toISOString());
        payload.append("gender", this.formData.jenisKelamin === "Laki-Laki" ? "Male" : "Female");
        payload.append("phone", this.formData.whatsapp);
        payload.append("subjects", this.formData.mapel);
        payload.append("status", this.mapStatusToEnum(this.formData.status));
        payload.append("major", this.formData.prodi);
        payload.append("school", this.formData.universitas);
        payload.append("teachLevel", this.formData.jenjang);
        payload.append("description", this.formData.deskripsi);
        payload.append("photo", this.formData.foto);

        // Kirim data ke server
        const res = await fetch("http://localhost:3000/apply", {
          method: "POST",
          body: payload,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal mendaftar sebagai tutor.");
        }

        alert("Pendaftaran berhasil! Kami akan menghubungi Anda segera.");
        this.$router.push("/registersuccess");
      } catch (err) {
        console.error("Error:", err);
        alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      } finally {
        this.isSubmitting = false;
      }
    },
    cancelForm() {
      this.$router.push("/");
    },
    mapStatusToEnum(status) {
      switch (status) {
        case "Mahasiswa Semester 1-2":
          return "TH1";
        case "Mahasiswa Semester 3-4":
          return "TH2";
        case "Mahasiswa Semester 5-6":
          return "TH3";
        case "Mahasiswa Semester 7-8":
          return "TH4";
        case "Mahasiswa Semester >8":
          return "TH5";
        case "Sarjana S1":
          return "S1";
        case "Magister S2":
          return "S2";
        case "Doktor S3":
          return "S3";
        default:
          return "";
      }
    },
  },
};
</script>

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
          <input type="date" id="tanggal-lahir" v-model="formData.tanggalLahir" />
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
          <input type="file" id="foto" @change="e => formData.foto = e.target.files[0]" />
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
            <option>Mahasiswa Semester 1-2</option>
            <option>Mahasiswa Semester 3-4</option>
            <option>Mahasiswa Semester 5-6</option>
            <option>Mahasiswa Semester 7-8</option>
            <option>Mahasiswa Semester >8</option>
            <option>Sarjana S1</option>
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

        <div class="form-group full-width">
          <label for="deskripsi">Deskripsi</label>
          <input type="text" id="deskripsi" placeholder="Tuliskan pengalaman mengajar Anda" v-model="formData.deskripsi"></input>
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
          type="button"
          :class="['day-button', { active: selectedDays.includes(day) }]"
          @click="toggleDay(day)"
        >
          {{ day }}
        </button>
      </div>
    </div>
    <div class="button-action">
      <!-- Tombol Submit -->
      <butPrimerHuge 
      label="Daftar Sebagai Tutor" 
      @click="submitForm"
      />
      <!-- Tombol batal -->
      <butSecondHuge 
      label="Batal" 
      @click="cancelForm"
      />
    </div>
  </div>
</template>


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

.gender-select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
}

.button-action {
  display: flex;
  justify-content: left;
  gap: 0.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .title-header {
    font-size: 2.5rem;
  }
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
  height: 100%;
}

input::placeholder {
  color: #9ca3af;
}

.input-with-icon {
  position: relative;
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
