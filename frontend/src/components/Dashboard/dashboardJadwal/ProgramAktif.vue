<script setup>
import { ref } from 'vue';

// 1. Data untuk program-program yang aktif
// Data ini bisa datang dari API di aplikasi nyata.
const activePrograms = ref([
  { subject: 'Matematika SMA', teacher: 'Pak Dendy Wan S.Pd', code: '#11234' },
  { subject: 'Matematika SD', teacher: 'Bu Luna S.Pd', code: '#11355' },
  { subject: 'Fisika SMA', teacher: 'Bu Wendy S.Pd', code: '#11237' },
  { subject: 'Seni SMA', teacher: 'Pak Wahyu Hendi S.Pd', code: '#11244' },
]);
</script>

<template>
  <div class="active-program-widget">
    <h2 class="widget-title">Program Aktif</h2>

    <n-space vertical :size="16">
      <n-card
        v-for="program in activePrograms"
        :key="program.code"
        class="program-card"
        :bordered="false"
      >
        <div class="card-header">
          <n-text class="subject-text">{{ program.subject }}</n-text>
          <n-text class="code-text">{{ program.code }}</n-text>
        </div>
          <n-text :depth="3" class="teacher-text">{{ program.teacher }}</n-text>
        </n-card>
      </n-space>
    </div>
  </template>