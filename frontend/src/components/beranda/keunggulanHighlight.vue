<script>
import { keunggulanData } from "@/assets/dataSementara/keunggulan.js";

export default {
  data() {
    return {
      keunggulan: keunggulanData.slice(0, 4), // Menampilkan hanya 4 item
    };
  },
};
</script>

<script setup>
import buttonProfile from '../dirButton/butProfile.vue'
</script>

<template>
  <div class="highlight-keunggulan">
    <h1 class="headerr2 title1">Mengapa pilih kami?</h1>
    <h2 class="headerb1 title2">Keunggulan</h2>
    <div class="padding-components">
      <div v-for="item in keunggulan" :key="item.id" class="grid-item">
        <div class="icon-wrapper">
          <img src="../../assets/check.svg" alt="visual" class="visual" />
        </div>
        <h3 class="headersb3">{{ item.title }}</h3>
        <p class="bodyr2 col-contents">{{ item.description }}</p>
      </div>
    </div>
    <buttonProfile class="button"/>
  </div>
</template>

<style scoped>
.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.visual {
  width: 50px;
  height: 50px;
  align-content: center;
}

.padding-components {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Default: 4 kolom */
  gap: 4rem;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.highlight-keunggulan {
  max-width: 100%;
  margin: 0 auto;
}
@media (max-width: 960px) {
  .padding-components {
    grid-template-columns: repeat(2, 1fr); /* 2 kolom saat layar < 960px */
    padding: 0 2rem;
    gap: 2rem;
  }
  
}
@media (max-width: 576px) {
  .padding-components {
    grid-template-columns: repeat(1, 1fr); /* 2 kolom saat layar < 960px */
    padding: 0 2rem;
  }
}
</style>

<style scoped>
.title1 {
    color: #FDC998 !important;
    text-align: center;
}
.title2 {
    color: #154484;
    text-align: center;
    margin-bottom: 12px;
}
.grid-item .headersb3 {
  color: #154484;
  text-align: center;
  margin-bottom: 4px;
}
.col-contents {
  color: #9BAFCB;
  text-align: justify;
  margin: 0 1rem;
}
.button{
    margin-top: 2rem;
}
</style>