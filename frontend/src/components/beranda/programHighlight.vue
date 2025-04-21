<script setup>
import card from '../card/kartuProgram.vue'
import ButtonProgram from '../dirButton/butprogram.vue'
</script>

<template>
  <div class="padding-components">
    <h1 class="headerr2 title1">Program</h1>
    <h2 class="headerb1 title2">Unggulan</h2>
    <card />
    <ButtonProgram class="button"/>
  </div>
</template>

<style scoped>
.button{
    margin-top: 2rem;
}
.title1 {
    color: #FDC998 !important;
    text-align: center;
}
.title2 {
    color: #154484;
    text-align: center;
    margin-bottom: 12px;
}
</style>