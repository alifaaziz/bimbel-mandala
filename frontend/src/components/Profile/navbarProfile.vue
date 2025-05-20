<template>
    <n-layout>
      <n-layout-header class="navbar-detail">
        <div class="arrow" @click="goBack">
          <img src="@/assets/arrow-left-circle.svg" alt="arrow" />
        </div>
        <div class="headlineb1 detail-title">Profile Peserta</div>
      </n-layout-header>
    </n-layout>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1); // Navigasi ke halaman sebelumnya
    }
  }
};
</script>

<style scoped>
.navbar-detail {
  width: 100%;
  height: 104px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 2rem 8rem;
  gap: 1rem;
  background-color: white;
}

.arrow {
  display: contents;
  align-items: center;
  height: 100%;
  cursor: pointer; /* Tambahkan pointer untuk menunjukkan elemen dapat diklik */
}

.arrow img {
  height: 40px;
  object-fit: contain;
}

.detail-title {
  color: #154484;
}

@media (max-width: 961px) {
  .navbar-detail {
    padding: 2rem 40px;
  }
}
</style>

