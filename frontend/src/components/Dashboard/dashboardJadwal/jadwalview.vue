<script setup>
import JadwalAktif from './JadwalAktif.vue';
import ProgramAktif from './ProgramAktif.vue';
</script>

<template>
    <div class="main-content">
        <JadwalAktif />
        <div class="right-side">
            <ProgramAktif />
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