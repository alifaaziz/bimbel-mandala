<script setup>
const props = defineProps({
  level: String,
  searchText: String,
  hari: Array,
  durasi: [Number, null],
});
</script>

<!-- <template>
  <div class="filter-program-box">
    <h3>Filter yang Aktif:</h3>
    <ul>
      <li v-if="level">Jenjang: {{ level }}</li>
      <li v-if="searchText">Pencarian: {{ searchText }}</li>
      <li v-if="hari?.length">Hari: {{ hari.join(', ') }}</li>
      <li v-if="durasi">Durasi: {{ durasi }} menit</li>
    </ul>
  </div>
</template> -->

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
</style>