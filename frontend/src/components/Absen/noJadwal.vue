<script setup>
</script>

<template>
    <div class="nojadwal-container">
        <img src="@/assets/noJadwal.svg" alt="Jadwal Kosong" class="nojadwal-img" />
        <div class="nojadwal-text">
            <h1 class="hero2">Kamu Belum memiliki Jadwal Saat ini.</h1>
            <p class="bodyr1">
                Saatnya bersiap! Jadwal akan muncul di sini begitu tersedia.
            </p>
        </div>
    </div>
    <programHighlight />
</template>


<style>
.nojadwal-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
}

.nojadwal-img {
    width: 100%;
    max-width: 360px;
    height: auto;
}

.nojadwal-text {
    width: 50%;
    color: #154484;
}
.nojadwal-text .hero2 {
    line-height: 1;
    padding-bottom: 1rem;
}
@media (max-width: 768px) {
  .nojadwal-container {
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 2rem;
    align-items: center;
  }
  .nojadwal-text {
    width: 100%;
    text-align: left;
  }
}
</style>