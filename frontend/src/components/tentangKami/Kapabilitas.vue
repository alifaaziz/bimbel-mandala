<script setup>
import { ref, onMounted } from 'vue';

const dataKababilitas = ref({
    jumlahTutor: 0,
    jumlahProgram: 0,
    programAktif: 0,
    siswa: 0,
});

onMounted(async () => {
    try {
        const res = await fetch('localhost:3000/users/statistics');
        const result = await res.json();
        const stats = result.data || {};
        dataKababilitas.value = {
            jumlahTutor: stats.tutorCount || 0,
            jumlahProgram: stats.packageCount || 0,
            programAktif: stats.activePackageCount || 0,
            siswa: stats.studentCount || 0,
        };
    } catch (err) {
        console.error('Gagal mengambil data:', err);
        dataKababilitas.value = {
            jumlahTutor: 0,
            jumlahProgram: 0,
            programAktif: 0,
            siswa: 0,
        };
    }
});
</script>

<template>
    <div class="data-container">
        <div class="contents">
            <div class="hero hero-data">
                Kapabilitas<br>Kita
            </div>
            <p class="copy">
                Bersama Bimbel Mandala, wujudkan cita-citamu masuk sekolah atau 
                perguruan tinggi favorit. Dapatkan bimbingan belajar terbaik dengan 
                tutor berpengalaman dan materi yang sesuai kurikulum.
            </p>
            <div class="data-wrapper">
                <div class="data-content">
                    <h3 class="bodyr3 data-title">Tahun Berdiri</h3>
                    <p class="hero hero-data">
                        2025
                    </p>
                </div>
                <div class="data-content">
                    <h3 class="bodyr3 data-title">Jumlah Tutor</h3>
                    <p class="hero hero-data">
                        {{ dataKababilitas.jumlahTutor }}
                    </p>
                </div>
                <div class="data-content">
                    <h3 class="bodyr3 data-title">Jumlah Program</h3>
                    <p class="hero hero-data">
                        {{ dataKababilitas.jumlahProgram }}
                    </p>
                </div>
                <div class="data-content">
                    <h3 class="bodyr3 data-title">Program Aktif</h3>
                    <p class="hero hero-data">
                        {{ dataKababilitas.programAktif }}
                    </p>
                </div>
                <div class="data-content">
                    <h3 class="bodyr3 data-title">Siswa</h3>
                    <p class="hero hero-data">
                        {{ dataKababilitas.siswa }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style setup>
    .data-container {
        height: 720px;
        display: flex;
        justify-content: center; /* Mengatur konten ke tengah secara horizontal */
        align-items: center; /* Mengatur konten ke tengah secara vertikal */
        text-align: center; /* Opsional: untuk memastikan teks rata tengah */
        position: relative; /* Dibutuhkan untuk pseudo-element */
        background-image: url('@/assets/bgKapabilitas.png'); /* Ganti dengan path gambar Anda */
        background-size: cover;
        background-position: center;
        width: 100%;
    }
    .data-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Warna overlay gelap dengan transparansi */
        z-index: 1; /* Pastikan overlay berada di atas background */
    }

    .data-container > * {
    position: relative;
    z-index: 2; /* Pastikan konten berada di atas overlay */
    }

    .data-wrapper {
        display: grid; /* Ubah dari flex ke grid */
        grid-template-columns: repeat(4, 1fr); /* Default: 4 kolom */
        gap: 1rem; /* Jarak antar elemen */
        padding: 0 1rem; /* Kurangi padding */
    }

    .data-title {
        color: white;
    }

    .contents {
        display: flex;
        flex-direction: column;
        justify-content: center; /* Mengatur konten ke tengah secara vertikal */
        align-items: center; /* Mengatur konten ke tengah secara horizontal */
        text-align: center; /* Opsional: untuk memastikan teks rata tengah */
        padding-top: 2rem;
    }
    .hero-data {
        color: white;
        text-align: center;
        width: 100%;
        margin: 1rem 0 !important;
    }
    .copy {
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        line-height: 2;
        font-family: 'Poppins', sans-serif;
        margin: 0 0 1rem!important;
        width: 60%;
        
    }
    p {
        padding: 0 !important;
    }

    .data-content {
        text-align: center; /* Teks rata tengah */
        padding: 1rem; /* Memberikan padding */
        border-radius: 8px; /* Opsional: Membuat sudut melengkung */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Opsional: Memberikan bayangan */
    }

    @media (max-width: 960px) {
        .data-wrapper {
            grid-template-columns: repeat(2, 1fr); /* Ubah menjadi 2 kolom pada layar sempit */
            gap: 1.5rem; /* Kurangi jarak antar elemen */
            padding: 0 2rem; /* Kurangi padding */
        }
        .hero-data {
            font-size: 2rem; /* Ukuran font untuk judul pada layar kecil */
        }
    }
    
</style>
