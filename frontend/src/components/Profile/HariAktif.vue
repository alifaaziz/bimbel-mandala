<script setup>
const props = defineProps({
  daysName: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="ajar-component">
    <h3 class="headersb3 title-bidang-ajar">
      Hari Aktif
    </h3>
    <div v-if="daysName.length">
      <span v-for="(hari, idx) in daysName" :key="idx" class="tag-hari">{{ hari }}</span>
    </div>
    <div v-else>
      Tidak ada hari aktif
    </div>
  </div>
</template>

<style scoped>
.title-bidang-ajar {
    color: #154484;
    align-items: left;
}
.ajar-component {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.tag-hari {
  background: #154484;
  color: #fff;
  padding: 0.3rem 1rem;
  border-radius: 1rem;
  margin-right: 0.5rem;
  display: inline-block;
  margin-bottom: 0.3rem;
}
.detail-separator {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  color: #061222;
}
.detail-separator p:last-child {
  margin: 0;
}
.detail-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 160px;
}

.detail-profile img {
  height: 20px;
}
</style>