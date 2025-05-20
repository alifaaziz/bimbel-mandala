<script setup>

</script>

<template>
  <div class="stats-container">
    <div class="stat-box">
      <p class="label headersb1">Program Berjalan</p>
      <p class="value hero">01</p>
    </div>
    <div class="stat-box">
      <p class="label headersb1">Program Selesai</p>
      <p class="value hero">03</p>
    </div>
  </div>
</template>


<style scoped>
.stats-container {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  width: 100%;
}

.stat-box {
  flex: 1;
  text-align: center;
}
  
.label {
  color: #f58220;
}

.value {
  color: #0f3b71;
}
</style>
