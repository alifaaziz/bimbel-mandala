<script setup>
import { ref, watch, computed } from "vue";
import { NDrawer } from 'naive-ui';
import filterProgram from "./filterProgram.vue";

// State untuk filter
const value = ref(null); // Jenjang
const searchText = ref(""); // Search
const selectedDays = ref([]); // Hari
const durasi = ref(null); // Durasi
const selectedPaket = ref([]); // Paket

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

const isFilterActive = (filterType) => {
  switch (filterType) {
    case 'jenjang':
      return value.value !== null;
    case 'search':
      return searchText.value.trim().length > 0;
    case 'hari':
      return selectedDays.value.length > 0;
    case 'durasi':
      return durasi.value !== null;
    case 'paket':
      return selectedPaket.value.length > 0;
    default:
      return false;
  }
};

const logActiveFilters = () => {
  console.log("Jenjang:", value.value);
  console.log("Search Text:", searchText.value);
  console.log("Hari:", [...selectedDays.value]);
  console.log("Durasi:", durasi.value);
  console.log("Paket:", [...selectedPaket.value]);
};

const onSearchEnter = () => {
  if (searchText.value.trim().length > 0) {
    console.log("Trigger pencarian lewat Enter:", searchText.value);
    logActiveFilters();
  } else {
    console.log("Kolom pencarian kosong.");
  }
};


const anyFilterActive = computed(() => {
  return (
    value.value !== null ||
    searchText.value.trim().length > 0 ||
    selectedDays.value.length > 0 ||
    durasi.value !== null ||
    selectedPaket.value.length > 0
  );
});

// Watcher
watch(value, logActiveFilters);
watch(searchText, logActiveFilters);
watch(selectedDays, logActiveFilters, { deep: true });
watch(durasi, logActiveFilters);
watch(selectedPaket, logActiveFilters, { deep: true });
</script>

<template>
  <div class="navbar-container">
    <div>
      <div class="jenjang-trigger">
        <img src="@/assets/icons/jenjang.svg" alt="">
        <n-select
          placeholder="SMA"
          class="bodysb1 select-jenjang"
          v-model:value="value"
          size="medium"
          :options="options"
          :class="{ active: isFilterActive('jenjang') }"
        />
      </div>
    </div>

    <div>
      <div class="search-bar">
        <img class="search-img" src="@/assets/icons/admin/search.svg" alt="">
        <input
          v-model="searchText"
          class="bodyr1 search-input"
          type="text"
          placeholder="Cari program bimbel..."
          :class="{ active: isFilterActive('search') }"
          @keyup.enter="onSearchEnter"
        />
      </div>
    </div>

    <div>
      <button class="menu-button filter-trigger-button" @click="toggleFilter">
        <img src="@/assets/icons/menu.svg" alt="">
      </button>
    </div>

    <n-drawer
      name="slide-from-right"
      v-model:show="drawerVisible"
      class="filter-open"
      :width="360"
    >
      <n-drawer-content title="Filter" closable>
        <!-- Hari -->
        <div class="filter" :class="{ active: isFilterActive('hari') }">
          <strong class="headersb3">Hari</strong>
          <n-checkbox-group v-model:value="selectedDays">
            <n-checkbox size="medium" label="Senin" value="Senin" />
            <n-checkbox size="medium" label="Selasa" value="Selasa" />
            <n-checkbox size="medium" label="Rabu" value="Rabu" />
            <n-checkbox size="medium" label="Kamis" value="Kamis" />
            <n-checkbox size="medium" label="Jum'at" value="Jum'at" />
          </n-checkbox-group>
        </div>

        <n-divider/>

        <!-- Durasi -->
        <div class="filter" :class="{ active: isFilterActive('durasi') }">
          <strong class="headersb3">Durasi</strong>
          <n-space vertical>
            <n-slider v-model:value="durasi" :step="30" :max="120" />
            <n-input-number
              v-model:value="durasi"
              size="small"
              :step="30"
              :max="120"
              :show-button="false"
            >
              <template #suffix>Menit</template>
            </n-input-number>
            <p class="bodyr3 found">99 program ditemukan</p>
          </n-space>
        </div>

        <n-divider/>

        <!-- Paket -->
        <div class="filter" :class="{ active: isFilterActive('paket') }">
          <strong class="headersb3">Paket</strong>
          <n-checkbox-group v-model:value="selectedPaket">
            <n-checkbox size="medium" label="1 kali seminggu" value="1x" />
            <n-checkbox size="medium" label="2 kali seminggu" value="2x" />
            <n-checkbox size="medium" label="3 kali seminggu" value="3x" />
            <n-checkbox size="medium" label="4 kali seminggu" value="4x" />
          </n-checkbox-group>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
  <div>
    <!-- Tampilkan hasil filter -->
    <filterProgram
      v-if="anyFilterActive"
      :jenjang="value"
      :search-text="searchText"
      :hari="selectedDays"
      :durasi="durasi"
      :paket="selectedPaket"
    />
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

.select-jenjang {
  width: 80px;
}

.jenjang-trigger {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

::v-deep(.select-jenjang .n-base-selection) {
  border-radius: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #e9ecef;
  border-radius: 20px;
  padding: 8px 15px;
  max-width: 400px;
}

.search-img {
  width: 14px;
  height: auto;
  margin-right: 12px;
}

.search-input {
  border: none;
  outline: none;
  background-color: transparent;
  flex-grow: 1;
  font-size: 14px;
  width: 360px;
}

.search-input::placeholder {
  color: #6c757d;
}

.menu-button {
  background-color: #154484;
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button:hover {
  background-color: #0b2343;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.found {
  color: #777E90;
}

@media (max-width: 768px) {
  .filter-drawer-content {
    width: 280px;
  }
}
</style>
