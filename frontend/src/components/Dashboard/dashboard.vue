<script setup>
import JadwalProgram from './jadwalProgram.vue';
import ChartProgram from './chartProgram.vue';
import ProgramAktifList from './ProgramAktifList.vue';
import TopTutor from './TopTutor.vue';
</script>

<template>
  <div class="main-content">
    <div class="jadwal-container">
      <JadwalProgram />
    </div>
    <div class="right-side">
      <div>
        <ChartProgram />
      </div>
      <div>
        <ProgramAktifList />
      </div>
      <div>
        <TopTutor />
      </div>
    </div>
  </div>
</template>


<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  padding: 20px 30px; /* Padding untuk konten utama */
  overflow-y: auto;
  background-color: #091c36;
}
.jadwal-container {
  background-color: #fff;
  width: 100%;
  border-radius: 12px;
}

.right-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>