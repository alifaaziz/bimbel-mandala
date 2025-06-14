<script setup>
import { ref } from "vue";
import { NDrawer } from 'naive-ui';

// State untuk select
const value = ref(null);
const options = [
  {
    label: 'SMA',
    value: 'SMA'
  },
  {
    label: 'SMP',
    value: 'SMP'
  },
  {
    label: 'SD',
    value: 'SD'
  }
];

const durasi = ref(60);

// State dan fungsi untuk drawer
const drawerVisible = ref(false);
const toggleFilter = () => {
  drawerVisible.value = !drawerVisible.value;
};
</script>

<template>
  <div class="navbar-container">
    <div>
      <div class="jenjang-trigger" >
        <img src="@/assets/icons/jenjang.svg" alt="">
        <n-select placeholder="SMA" class="bodysb1 select-jenjang" v-model:value="value" size="medium" :options="options" />
      </div>
    </div>

    <div>
      <div class="search-bar">
        <img class="search-img" src="@/assets/icons/admin/search.svg" alt="">
        <input class="bodyr1 search-input" type="text" placeholder="Cari program bimbel..." />
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
        <div class="filter">
          <strong class="headersb3">Hari</strong>
          <n-checkbox size="medium" label="Senin" />
          <n-checkbox size="medium" label="Selasa" />
          <n-checkbox size="medium" label="Rabu" />
          <n-checkbox size="medium" label="Kamis" />
          <n-checkbox size="medium" label="Jum'at" />
        </div>
        <n-divider/>
        <div class="filter">
          <strong class="headersb3">Durasi</strong>
            <n-space vertical>
              <n-slider v-model:value="durasi" :step="30" :max="120" />
              <n-input-number 
              v-model:value="durasi" 
              size="small"
              :marks="marks"
              :step="30"
              :max="120" 
              :show-button="false"
              >
                <template #suffix>
                  Menit
                </template>
              </n-input-number>
              <p class="bodyr3 found">99 program ditemukan</p>
            </n-space>
        </div>
        <n-divider/>
        <div class="filter">
          <strong class="headersb3">Paket</strong>
          <n-checkbox size="medium" label="1 kali seminggu" />
          <n-checkbox size="medium" label="2 kali seminggu" />
          <n-checkbox size="medium" label="3 kali seminggu" />
          <n-checkbox size="medium" label="4 kali seminggu" />
        </div>
      </n-drawer-content>
    </n-drawer>
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

.found{
  color: #777E90;
}
@media (max-width: 768px) {
  .filter-drawer-content {
    width: 280px;
  }
}
</style>
