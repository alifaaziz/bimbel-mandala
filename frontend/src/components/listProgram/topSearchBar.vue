<template>
  <div class="navbar-container">
    <div class="navbar-left">
      <div class="jenjang-trigger" @click="toggleJenjangDrawer" ref="jenjangTriggerRef">
        <span class="logo">🎓</span>
        <span class="text">{{ selectedJenjang }}</span>
        <svg v-if="!isJenjangDrawerOpen" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-caret-down-fill arrow-icon" viewBox="0 0 16 16">
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-caret-up-fill arrow-icon" viewBox="0 0 16 16">
          <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
        </svg>
      </div>

      <transition name="slide-fade">
        <div v-if="isJenjangDrawerOpen" class="jenjang-drawer" ref="jenjangDrawerRef">
          <div class="drawer-header">
            <span>Jenjang</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up arrow-icon-header" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
            </svg>
          </div>
          <ul>
            <li
              v-for="jenjang in jenjangOptions"
              :key="jenjang.id"
              :class="{ active: jenjang.nama === selectedJenjang }"
              @click="selectJenjang(jenjang.nama)"
            >
              {{ jenjang.nama }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <div class="navbar-center">
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search search-icon" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
        <input type="text" placeholder="Cari program bimbel..." />
      </div>
    </div>

    <div class="navbar-right">
      <button class="menu-button filter-trigger-button" @click="toggleFilterDrawer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>
    </div>

    <transition name="slide-from-right">
      <div v-if="isFilterDrawerOpen" class="filter-drawer-overlay" @click.self="closeFilterDrawer">
        <div class="filter-drawer-content" ref="filterDrawerRef">
          <div class="filter-drawer-header">
            <span>FILTER</span>
            <button @click="closeFilterDrawer" class="close-filter-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
              </svg>
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-section-header" @click="toggleFilterSection('hari')">
              <h3>Hari</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" :class="{'rotate-180': !openFilterSections.hari}">
                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
              </svg>
            </div>
            <div v-show="openFilterSections.hari" class="filter-options">
              <div v-for="item in filterData.hari" :key="item.id" class="filter-option checkbox-option">
                <input type="checkbox" :id="'hari-' + item.id" v-model="selectedFilters.hari" :value="item.name">
                <label :for="'hari-' + item.id">{{ item.name }}</label>
                <span>{{ item.count }}</span>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-section-header" @click="toggleFilterSection('durasi')">
              <h3>Durasi</h3>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" :class="{'rotate-180': !openFilterSections.durasi}">
                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
              </svg>
            </div>
            <div v-show="openFilterSections.durasi" class="filter-options">
              <input type="text" class="duration-input" v-model="selectedFilters.durasi" placeholder="Contoh: 1 jam, 30 menit">
              <div class="range-slider-placeholder">
                <div class="slider-track">
                    <div class="slider-thumb" style="left: 20%;"></div>
                    <div class="slider-thumb" style="left: 70%;"></div>
                </div>
              </div>
              <p class="products-found">38 products found</p>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-section-header" @click="toggleFilterSection('paket')">
              <h3>Paket</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" :class="{'rotate-180': !openFilterSections.paket}">
                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
              </svg>
            </div>
            <div v-show="openFilterSections.paket" class="filter-options">
              <div v-for="item in filterData.paket" :key="item.id" class="filter-option checkbox-option">
                <input type="checkbox" :id="'paket-' + item.id" v-model="selectedFilters.paket" :value="item.name">
                <label :for="'paket-' + item.id">{{ item.name }}</label>
                <span>{{ item.count }}</span>
              </div>
            </div>
          </div>

          <div class="filter-actions">
            <button class="apply-button">Terapkan Filter</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'NavbarComponent',
  data() {
    return {
      // Jenjang Drawer Data
      isJenjangDrawerOpen: false,
      selectedJenjang: 'SMA',
      jenjangOptions: [
        { id: 1, nama: 'SMA' },
        { id: 2, nama: 'SMP' },
        { id: 3, nama: 'SD' },
      ],

      // Filter Drawer Data
      isFilterDrawerOpen: false,
      openFilterSections: { // Untuk mengontrol expand/collapse tiap section filter
        hari: true,
        durasi: true,
        paket: true,
      },
      filterData: {
        hari: [
          { id: 'h1', name: 'Senin', count: 96, selected: false },
          { id: 'h2', name: 'Selasa', count: 71, selected: true },
          { id: 'h3', name: 'Rabu', count: 96, selected: false },
          { id: 'h4', name: 'Kamis', count: 71, selected: true },
          { id: 'h5', name: 'Jumat', count: 71, selected: true },
          { id: 'h6', name: 'Sabtu', count: 71, selected: true },
        ],
        paket: [
          { id: 'p1', name: '1 kali seminggu', count: 96, selected: false },
          { id: 'p2', name: '2 kali seminggu', count: 71, selected: true },
          { id: 'p3', name: '3 kali seminggu', count: 96, selected: false },
          { id: 'p4', name: '4 kali seminggu', count: 71, selected: true },
        ],
      },
      selectedFilters: {
        hari: ['Selasa', 'Kamis', 'Jumat', 'Sabtu'], // Inisialisasi berdasarkan gambar
        durasi: '1 jam, 30 Menit', // Inisialisasi berdasarkan gambar
        paket: ['2 kali seminggu', '4 kali seminggu'], // Inisialisasi berdasarkan gambar
      },
    };
  },
  methods: {
    // Jenjang Drawer Methods
    toggleJenjangDrawer() {
      this.isJenjangDrawerOpen = !this.isJenjangDrawerOpen;
      if (this.isJenjangDrawerOpen) this.isFilterDrawerOpen = false; // Tutup filter jika jenjang dibuka
    },
    selectJenjang(jenjang) {
      this.selectedJenjang = jenjang;
      this.isJenjangDrawerOpen = false;
      console.log('Jenjang dipilih:', jenjang);
    },
    handleClickOutsideJenjang(event) {
      if (this.isJenjangDrawerOpen &&
          this.$refs.jenjangTriggerRef && !this.$refs.jenjangTriggerRef.contains(event.target) &&
          this.$refs.jenjangDrawerRef && !this.$refs.jenjangDrawerRef.contains(event.target)) {
        this.isJenjangDrawerOpen = false;
      }
    },

    // Filter Drawer Methods
    toggleFilterDrawer() {
      this.isFilterDrawerOpen = !this.isFilterDrawerOpen;
      if (this.isFilterDrawerOpen) this.isJenjangDrawerOpen = false; // Tutup jenjang jika filter dibuka
    },
    closeFilterDrawer() {
      this.isFilterDrawerOpen = false;
    },
    toggleFilterSection(section) {
      this.openFilterSections[section] = !this.openFilterSections[section];
    },
    handleClickOutsideFilter(event) {
        // Cek apakah klik terjadi di luar .filter-drawer-content dan bukan pada .filter-trigger-button
        // Ini dicegah karena .filter-drawer-overlay sudah menangani click.self
        // Jika tidak menggunakan overlay dengan .self, logika ini diperlukan:
        // if (this.isFilterDrawerOpen &&
        //     this.$refs.filterDrawerRef && !this.$refs.filterDrawerRef.contains(event.target) &&
        //     !event.target.closest('.filter-trigger-button') // Pastikan klik bukan pada tombol trigger lagi
        // ) {
        //   this.isFilterDrawerOpen = false;
        // }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutsideJenjang);
    // Event listener untuk klik di luar filter drawer sudah ditangani oleh @click.self pada overlay
    // Jika tidak menggunakan .self, Anda perlu menambahkan listener seperti ini:
    // document.addEventListener('click', this.handleClickOutsideFilter);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutsideJenjang);
    // document.removeEventListener('click', this.handleClickOutsideFilter);
  }
};
</script>

<style scoped>
/* ... (CSS dari NavbarComponent sebelumnya tetap ada) ... */

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  font-family: sans-serif;
  position: relative;
}

/* Navbar Left (Jenjang) Styles */
.navbar-left {
  display: flex;
  align-items: center;
  position: relative;
}
.jenjang-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  user-select: none;
}
.logo {
  font-size: 24px;
  margin-right: 8px;
  color: #0056b3;
}
.jenjang-trigger .text {
  font-weight: bold;
  margin-right: 8px;
  color: #0056b3;
  font-size: 16px;
}
.arrow-icon {
  color: #0056b3;
}
.jenjang-drawer {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 200px;
  z-index: 1050; /* Pastikan di atas filter overlay jika terbuka bersamaan */
  overflow: hidden;
}
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: bold;
  color: #0056b3;
}
.arrow-icon-header {
 color: #0056b3;
}
.jenjang-drawer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.jenjang-drawer li {
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
  color: #333;
}
.jenjang-drawer li:hover {
  background-color: #f0f0f0;
}
.jenjang-drawer li.active {
  background-color: #0056b3;
  color: white;
  font-weight: bold;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Navbar Center (Search) Styles */
.navbar-center {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;
}
.search-bar {
  display: flex;
  align-items: center;
  background-color: #e9ecef;
  border-radius: 20px;
  padding: 8px 15px;
  width: 100%;
  max-width: 400px;
}
.search-icon {
  margin-right: 10px;
  color: #6c757d;
}
.search-bar input {
  border: none;
  outline: none;
  background-color: transparent;
  flex-grow: 1;
  font-size: 14px;
}
.search-bar input::placeholder {
  color: #6c757d;
}

/* Navbar Right (Menu Button) Styles */
.navbar-right {
  display: flex;
  align-items: center;
}
.menu-button { /* Ini juga berlaku untuk .filter-trigger-button */
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-button:hover {
  background-color: #004494;
}
.menu-button svg {
  display: block;
}


/* Filter Drawer Styles */
.filter-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Overlay gelap */
  z-index: 1000; /* Di bawah konten drawer tapi di atas halaman utama */
  display: flex;
  justify-content: flex-end; /* Posisikan drawer content ke kanan */
}

.filter-drawer-content {
  background-color: #ffffff;
  width: 320px; /* Sesuaikan lebar drawer filter */
  max-width: 90%;
  height: 100%;
  box-shadow: -2px 0 8px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Scroll jika konten lebih panjang */
}

.filter-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa; /* Latar header sedikit berbeda */
}

.filter-drawer-header span {
  font-size: 20px;
  font-weight: bold;
  color: #0056b3; /* Warna teks FILTER */
}

.close-filter-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  color: #555;
}
.close-filter-button:hover {
    color: #000;
}

.filter-section {
  padding: 0px 20px;
  border-bottom: 1px solid #e9ecef;
}
.filter-section:last-of-type {
    border-bottom: none;
}

.filter-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
}

.filter-section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.filter-section-header svg {
  color: #0056b3;
  transition: transform 0.2s ease-in-out;
}
.filter-section-header svg.rotate-180 {
  transform: rotate(180deg);
}

.filter-options {
  padding-bottom: 16px;
}

.filter-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.checkbox-option label {
  margin-left: 8px;
  flex-grow: 1;
  cursor: pointer;
  color: #555;
}
.checkbox-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #0056b3; /* Warna checkbox saat tercentang */
  cursor: pointer;
}
.checkbox-option span { /* Untuk angka count */
  color: #777;
  font-size: 13px;
}

.duration-input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
}

.range-slider-placeholder { /* Placeholder untuk slider */
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin: 10px 0;
  position: relative;
  padding: 0 10px; /* Padding agar thumb tidak mentok */
}
.slider-track {
    height: 6px;
    background-color: #0056b3;
    position: absolute;
    top: 50%;
    left: 10px;
    right: 10px;
    transform: translateY(-50%);
    border-radius: 3px;
}
.slider-thumb {
    width: 16px;
    height: 16px;
    background-color: #0056b3;
    border: 2px solid white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    cursor: pointer;
}


.products-found {
  font-size: 13px;
  color: #6c757d;
  margin-top: 8px;
  text-align: left;
}

.filter-actions {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.apply-button {
  width: 100%;
  padding: 12px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.apply-button:hover {
  background-color: #004494;
}


/* Transisi untuk Filter Drawer (Slide dari Kanan) */
.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: opacity 0.3s ease;
}
.slide-from-right-enter-active .filter-drawer-content,
.slide-from-right-leave-active .filter-drawer-content {
  transition: transform 0.3s ease;
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  opacity: 0;
}
.slide-from-right-enter-from .filter-drawer-content,
.slide-from-right-leave-to .filter-drawer-content {
  transform: translateX(100%);
}


@media (max-width: 768px) {
  /* ... (CSS media query sebelumnya tetap ada) ... */
  .navbar-center {
    margin: 0 10px;
  }
  .search-bar {
    max-width: none;
  }
  .jenjang-drawer {
    width: 180px;
  }
  .filter-drawer-content {
    width: 280px; /* Lebar filter drawer pada layar kecil */
  }
}
</style>