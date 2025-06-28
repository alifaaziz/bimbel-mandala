<script setup>
import JadwalAktif from './JadwalAktif.vue';
import ProgramAktif from './ProgramAktif.vue';
import DetailJadwal from './DetailJadwal.vue';
</script>

<template>
    <div class="main-content">
        <JadwalAktif />
        <div>
            <ProgramAktif />
            <DetailJadwal />
        </div>
    </div>
</template>

<style>
.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  padding: 20px;
  overflow-y: auto;
  background-color: #0B2343;
}
</style>