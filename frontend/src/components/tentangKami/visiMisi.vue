<script setup>

</script>

<template>
    <div class="visi-content">
      <div class="visi-image">
        <img 
          src="@/assets/visi.jpg" 
          alt="Cover Image" 
        />
      </div>
      <div>
        <h3 class="visi-title headerb1">Visi</h3>
        <p class="visi-text bodyr2">
          Menjadi platform bimbingan belajar inovatif yang 
          mengoptimalkan potensi setiap siswa melalui teknologi, 
          metode pembelajaran interaktif, dan pendampingan personal 
          untuk mencapai prestasi akademik dan keterampilan abad 21.
        </p>
      </div>
    </div>
    <div class="misi-content">
      <div class="misi-image">
        <img 
          src="@/assets/misi.jpg" 
          alt="Cover Image" 
        />
      </div>
      <div>
        <h3 class="misi-title headerb1">Misi</h3>
        <ul class="misi-text bodyr2">
          <li>Menyediakan pembelajaran berbasis teknologi dengan sistem Learning Management System (LMS) yang interaktif dan adaptif.</li>
          <li>Meningkatkan efektivitas pembelajaran melalui metode blended learning yang menggabungkan kelas offline dan online.</li>
          <li>Menyediakan tutor berkualitas yang profesional, berpengalaman, dan terus mengikuti perkembangan dunia pendidikan.</li>
          <li>Menawarkan kurikulum yang fleksibel dan dapat disesuaikan dengan kebutuhan serta tingkat pemahaman siswa.</li>
        </ul>
      </div>
    </div>
</template>

<style scoped>
.visi-content {
  display: flex;
  gap: 2rem;
  padding: 2rem 8rem; /* Mengubah padding kanan dan kiri menjadi 2rem */
}

.misi-content {
  display: flex;
  flex-direction: row-reverse; /* Membuat gambar berada di sebelah kanan */
  gap: 2rem;
  padding: 2rem 8rem; /* Mengubah padding kanan dan kiri menjadi 2rem */
}

.visi-title, .misi-title {
  text-align: left;
  color: #154484;
}

.visi-text, .misi-text {
  text-align: left;
  margin: 0 !important;
  color: #061222;
}

.visi-image img, .misi-image img {
  width: 200px; /* Ukuran lebar diperbesar */
  height: 200px; /* Ukuran tinggi diperbesar */
  object-fit: cover;
  border-radius: 8px; /* Opsional: Membuat gambar memiliki sudut melengkung */
}

.card-text {
  text-align: left; /* Membuat teks rata kiri */
}

.card-text h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.card-text p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

@media (max-width: 960px) {
  .visi-image img, .misi-image img {
    display: none; /* Menyembunyikan gambar */
  }
  .visi-content {
    padding: 2rem 2rem; /* Mengubah padding kanan dan kiri menjadi 2rem */
    gap: 0rem;
  }

  .misi-content {
    padding: 2rem 2rem; /* Mengubah padding kanan dan kiri menjadi 2rem */
    gap: 0rem;
  }
}
</style>