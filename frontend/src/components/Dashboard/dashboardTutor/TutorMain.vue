<script setup>
import TutorView from './TutorView.vue';
import listPendaftar from './listPendaftar.vue';
import TutorTerbaru from './TutorTerbaru.vue';
import TopTutor from '../TopTutor.vue';
</script>

<template>
    <div class="main-content">
        <TutorView />
        <div class="right-side">
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
  padding: 20px; /* Padding untuk konten utama */
  overflow-y: auto;
  background-color: #0B2343;
}

.right-side {
  min-width: 288px;
}
</style>