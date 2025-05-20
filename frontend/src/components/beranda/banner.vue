<template>
  <n-carousel
    dot-placement="bottom"
    autoplay
    interval="3000"
    class="custom-carousel"
    draggable="true"
    :slides-per-view="slidesPerView"
  >
    <div class="image-container">
      <img
        class="carousel-img"
        src="../../images/Banner1.png"
        alt="Image 1"
      />
    </div>
    <div class="image-container">
      <img
        class="carousel-img"
        src="../../images/Banner2.png"
        alt="Image 3"
      />
    </div>
    <div class="image-container">
      <img
        class="carousel-img"
        src="../../images/Banner4.png"
        alt="Image 5"
      />
    </div>
    <div class="image-container">
      <img
        class="carousel-img"
        src="../../images/Banner3.png"
        alt="Image 7"
      />
    </div>
  </n-carousel>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { NCarousel } from 'naive-ui';

export default defineComponent({
  name: 'Banner',
  components: {
    NCarousel,
  },
  setup() {
    const slidesPerView = ref(window.innerWidth <= 964 ? 1 : 2);

    const updateSlidesPerView = () => {
      slidesPerView.value = window.innerWidth <= 964 ? 1 : 2;
    };

    onMounted(() => {
      window.addEventListener('resize', updateSlidesPerView);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateSlidesPerView);
    });

    return {
      slidesPerView,
    };
  },
});
</script>

<style scoped>
.custom-carousel {
  width: 80%;
  max-width: 100%;
  height: auto; /* Ubah dari fixed height ke auto */
  padding-bottom: 40px;
  border-radius: 16px;
  margin: 0 auto;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem; /* Setengah dari gap total (1rem) */
  box-sizing: border-box;
}

.carousel-img {
  width: 100%; /* Gambar isi penuh div image-container */
  height: auto;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  aspect-ratio: 16 / 9;
}

/* Media query untuk layar dengan lebar maksimum 964px */
@media (max-width: 1024px) {
  .image-container {
    flex-direction: column; 
    height: auto; 
    gap: 1rem; 
  }

  .carousel-img {
    width: 100%; /* Gambar memenuhi lebar container */
    aspect-ratio: 16 / 9; /* Menjaga rasio gambar tetap 16:9 */
    margin: 0 1rem; /* Hapus margin untuk mendekatkan gambar */
    border-radius: 16px;
  }

  .custom-carousel {
    height: auto; /* Tinggi carousel fleksibel */
    width: 80%; /* Carousel memenuhi lebar container */
  }

  @media (max-width: 576px) {
    .carousel-img {
      width: 100%; /* Gambar memenuhi lebar container */
      height: auto; /* Tinggi gambar otomatis */
      aspect-ratio: 16 / 9; /* Menjaga rasio gambar tetap 16:9 */
      margin: 0 0rem;
    }
    .custom-carousel {
    height: auto; /* Tinggi carousel fleksibel */
    width: 90%; /* Carousel memenuhi lebar container */
  }
  }
  @media (max-width: 480px) {
    .carousel-img {
      width: 100%; /* Gambar memenuhi lebar container */
      height: auto; /* Tinggi gambar otomatis */
      aspect-ratio: 16 / 9; /* Menjaga rasio gambar tetap 16:9 */
      margin: 0 2rem;
    }
  }
}

::v-deep(.n-carousel__dots .n-carousel__dot) {
  background-color: #DEE4EE !important;
}

::v-deep(.n-carousel__dots .n-carousel__dot--active) {
  background-color: #154484 !important;
}
</style>