<script setup>
defineProps({
  jenjang: String,
  searchText: String,
  hari: Array,
  durasi: [Number, null],
  paket: Array
});
</script>

<template>
  <div class="filter-program-box">
    <h3>Filter yang Aktif:</h3>
    <ul>
      <li v-if="jenjang">Jenjang: {{ jenjang }}</li>
      <li v-if="searchText">Pencarian: {{ searchText }}</li>
      <li v-if="hari.length">Hari: {{ hari.join(', ') }}</li>
      <li v-if="durasi">Durasi: {{ durasi }} menit</li>
      <li v-if="paket.length">Paket: {{ paket.join(', ') }}</li>
    </ul>
  </div>
</template>

<style scoped>
.filter-program-box {
  margin: 20px auto;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 12px;
  max-width: 600px;
  font-family: sans-serif;
}

ul {
  padding-left: 1rem;
}

h3, ul {
    color: black;
}

li {
  margin-bottom: 8px;
}
</style>
