<script setup>
import { ref, watch, computed } from "vue";
import { NDrawer } from 'naive-ui';
import FilterProgram from "./filterProgram.vue";
import ProgramFiltered from "./ProgramFiltered.vue";

// State untuk filter
const value = ref(null); // Jenjang
const searchText = ref(""); // Search
const selectedDays = ref([]); // Hari
const durasi = ref(null); // Durasi

const options = [
  { label: 'SMA', value: 'SMA' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SD', value: 'SD' }
];

// Drawer control
const drawerVisible = ref(false);
const toggleFilter = () => {
  drawerVisible.value = !drawerVisible.value;
};

const anyFilterActive = computed(() => {
  return (
    value.value !== null ||
    searchText.value.trim().length > 0 ||
    selectedDays.value.length > 0 ||
    durasi.value !== null
  );
});

const activeFilters = computed(() => ({
  level: value.value,
  searchText: searchText.value,
  hari: selectedDays.value,
  durasi: durasi.value,
}));

</script>

<template>
  <div class="navbar-container">
    <div class="jenjang-trigger">
      <img src="@/assets/icons/jenjang.svg" alt="">
      <n-select
        placeholder="SMA"
        class="bodysb1 select-jenjang"
        v-model:value="value"
        size="medium"
        :options="options"
      />
    </div>

    <div class="search-bar">
      <img class="search-img" src="@/assets/icons/admin/search.svg" alt="">
      <input
        v-model="searchText"
        class="bodyr1 search-input"
        type="text"
        placeholder="Cari program bimbel..."
        @keyup.enter="toggleFilter"
      />
    </div>

    <div>
      <button class="menu-button filter-trigger-button" @click="toggleFilter">
        <img src="@/assets/icons/menu.svg" alt="">
      </button>
    </div>

    <n-drawer v-model:show="drawerVisible" class="filter-open" :width="360">
      <n-drawer-content title="Filter" closable>
        <!-- Hari -->
        <div class="filter">
          <strong>Hari</strong>
          <n-checkbox-group v-model:value="selectedDays">
            <n-checkbox label="Senin" value="Senin" />
            <n-checkbox label="Selasa" value="Selasa" />
            <n-checkbox label="Rabu" value="Rabu" />
            <n-checkbox label="Kamis" value="Kamis" />
            <n-checkbox label="Jum'at" value="Jumat" />
            <n-checkbox label="Sabtu" value="Sabtu" />
            <n-checkbox label="Minggu" value="Minggu" />
          </n-checkbox-group>
        </div>

        <n-divider/>

        <div class="filter">
          <strong>Durasi</strong>
          <n-space vertical>
            <n-slider v-model:value="durasi" :step="30" :max="120" />
            <n-input-number v-model:value="durasi" :step="30" :max="120" :show-button="false">
              <template #suffix>Menit</template>
            </n-input-number>
          </n-space>
        </div>

        <n-divider/>

      </n-drawer-content>
    </n-drawer>
  </div>

  <div>
    <FilterProgram
      v-if="anyFilterActive"
      :level="activeFilters.level"
      :searchText="activeFilters.searchText"
      :hari="activeFilters.hari"
      :durasi="activeFilters.durasi"
    />
  </div>

  <div>
    <ProgramFiltered v-if="anyFilterActive" :filters="activeFilters" />
  </div>
</template>

<style scoped>
.navbar-container {
  display: flex;
  flex-direction: row;
  justify-content: right;
  gap: 2rem;
  align-items: center;
  background-color: #fff;
  font-family: sans-serif;
  position: relative;
}
.select-jenjang { width: 80px; }
.jenjang-trigger { display: flex; flex-direction: row; gap: 1rem; }
.search-bar { display: flex; align-items: center; background-color: #e9ecef; border-radius: 20px; padding: 8px 15px; max-width: 400px; }
.search-img { width: 14px; margin-right: 12px; }
.search-input { border: none; outline: none; background-color: transparent; flex-grow: 1; font-size: 14px; width: 360px; }
.menu-button { background-color: #154484; border: none; padding: 10px 12px; border-radius: 8px; cursor: pointer; }
.menu-button:hover { background-color: #0b2343; }
.filter { display: flex; flex-direction: column; gap: 0.5rem; }
</style>
