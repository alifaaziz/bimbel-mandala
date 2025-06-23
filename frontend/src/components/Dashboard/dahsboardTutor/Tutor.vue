<script setup lang="ts">
import TutorView from './TutorView.vue';
import listPendaftar from './listPendaftar.vue';
import TutorTerbaru from './TutorTerbaru.vue';
import TopTutor from '../TopTutor.vue';
</script>

<template>
    <div class="main-content">
        <TutorView />
        <div>
            <listPendaftar />
            <TutorTerbaru />
            <TopTutor />
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
</style>