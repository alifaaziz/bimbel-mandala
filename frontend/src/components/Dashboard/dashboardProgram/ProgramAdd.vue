<script setup>
import InputDetailProgram from './InputDetailProgram.vue';
import InputBiayaProgram from './InputBiayaProgram.vue';
import InputDetailKelas from './InputDetailKelas.vue';
import actionbutton from './actionbutton.vue';
</script>

<template>
    <div class="main-content">
        <InputDetailProgram />
        <div>
            <InputBiayaProgram />
            <InputDetailKelas />
            <actionbutton />
        </div>
    </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  padding: 20px;
  overflow-y: auto;
  background-color: #0B2343;
}
</style>