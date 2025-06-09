<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar-container">
      <SideBar />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Jadwal Program -->
      <div class="jadwal-container">
        <JadwalProgram />
      </div>
    </div>

    <!-- Right Panel -->
    <div class="right-panel">
      <!-- Chart Program -->
      <div class="chart-container">
        <ChartProgram :programAktif="15" :programDibuka="85" />
      </div>

      <!-- Program Aktif -->
      <div class="program-aktif-container">
        <ProgramAktifList />
      </div>

      <!-- Top Tutor -->
      <div class="top-tutor-container">
        <TopTutor />
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from './sideBar.vue';
import JadwalProgram from './jadwalProgram.vue';
import ChartProgram from './chartProgram.vue';
import ProgramAktifList from './ProgramAktifList.vue';
import TopTutor from './TopTutor.vue';

export default {
  name: 'DashboardPage',
  components: {
    SideBar,
    JadwalProgram,
    ChartProgram,
    ProgramAktifList,
    TopTutor,
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: row;
  height: 100vh; /* Tinggi penuh viewport */
  background-color: #f8f9fa; /* Warna latar belakang dashboard */
}

.sidebar-container {
  flex: 0 0 5%;
  background-color: #091c36; /* Warna latar sidebar */
}

.main-content {
  flex: 0 0 60%; /* Jadwal 1/2 layar */
  padding: 20px 30px; /* Padding untuk konten utama */
  overflow-y: auto; /* Scroll jika konten terlalu panjang */
}

.jadwal-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Shadow untuk kontainer jadwal */
  height: 100%; /* Tinggi penuh untuk menyesuaikan */
}

.right-panel {
  flex: 0 0 25%; /* Panel kanan 1/4 layar */
  display: flex;
  flex-direction: column;
  gap: 20px; /* Jarak antar komponen di panel kanan */
  padding: 20px;
  background-color: #f8f9fa; /* Warna latar panel kanan */
  overflow-y: auto; /* Scroll jika konten terlalu panjang */
}

.chart-container,
.program-aktif-container,
.top-tutor-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Shadow untuk kontainer */
  flex: 1; /* Membagi tinggi secara merata */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Pusatkan konten secara vertikal */
}
</style>