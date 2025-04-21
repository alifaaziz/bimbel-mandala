<template>
  <n-carousel
    dot-placement="bottom"
    autoplay
    interval="3000"
    class="custom-carousel"
    draggable="true"
  >
    <div class="image-container">
      <img
        class="carousel-img"
        src="../../images/Banner.png"
        alt="Image 1"
      />
    </div>
    <div class="image-container">
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
        alt="Image 3"
      />
    </div>
    <div class="image-container">
      <img
        class="carousel-img"
        src="../../images/Banner.png"
        alt="Image 5"
      />
    </div>
    <div class="image-container">
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
        alt="Image 7"
      />
    </div>
  </n-carousel>
</template>

<script>
import { defineComponent } from 'vue';
import { NCarousel } from 'naive-ui';

export default defineComponent({
  name: 'Banner',
  components: {
    NCarousel,
  },
});
</script>

<style scoped>
.custom-carousel {
  width: 80%; /* Carousel memenuhi lebar container */
  height: 280px; /* Atur tinggi carousel */
  position: relative; /* Tambahkan posisi relatif untuk mengatur dot */
  padding-bottom: 40px; /* Tambahkan padding bawah untuk memberi ruang pada dot */
  border-radius: 8px;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* Atur gambar ke tengah */
  align-items: center;
  border-radius: 8px;
  gap: 8px; /* Tambahkan jarak antar gambar (opsional, bisa diatur lebih kecil) */
}

.carousel-img {
  width: 464px; /* Gambar memenuhi container */
  height: 100%; /* Gambar memenuhi container */
  object-fit: cover; /* Memastikan gambar tidak terdistorsi */
  border-radius: 8px; /* Menambahkan radius pada sudut gambar */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Menambahkan bayangan pada gambar */
  margin: 0; /* Hapus margin untuk mendekatkan gambar */
}

/* Media query untuk layar dengan lebar maksimum 964px */
@media (max-width: 964px) {
  .image-container {
    flex-direction: column; /* Ubah arah flex menjadi kolom */
    height: auto; /* Tinggi container fleksibel mengikuti konten */
    gap: 16px; /* Tambahkan jarak antar gambar untuk layar kecil */
  }

  .carousel-img {
    width: 100%; /* Gambar memenuhi lebar container */
    aspect-ratio: 16 / 9; /* Menjaga rasio gambar tetap 16:9 */
    margin: 0; /* Hapus margin untuk mendekatkan gambar */
    border-radius: 8px;
  }

  .custom-carousel {
    height: auto; /* Tinggi carousel fleksibel */
    width: 100%; /* Carousel memenuhi lebar container */
  }
}

::v-deep(.n-carousel__dots .n-carousel__dot) {
  background-color: #DEE4EE !important;
}

::v-deep(.n-carousel__dots .n-carousel__dot--active) {
  background-color: #154484 !important;
}
</style>