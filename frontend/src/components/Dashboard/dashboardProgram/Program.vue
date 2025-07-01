<script setup>
import daftarProgram from './daftarProgram.vue';
import OrderedProgram from './OrderedProgram.vue';
import ProgramSummary from './ProgramSummary.vue';
import ActivePrograms from './ActivePrograms.vue';
  
</script>

<template>
    <div class="main-content">
        Program Dashboard
    </div>
</template>

<style scoped>
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