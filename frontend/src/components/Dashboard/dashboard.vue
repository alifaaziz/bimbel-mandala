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
      <div class="right-side">
        <div>
          <ChartProgram />
        </div>
        <div>
          <ProgramAktifList />
        </div>
        <div>
          <TopTutor />
        </div>
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
  height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  padding: 20px 30px; /* Padding untuk konten utama */
  overflow-y: auto;
  background-color: #091c36;
}
.jadwal-container {
  background-color: #fff;
  width: 100%;
  border-radius: 12px;
}

.right-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar-toggle {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
}
</style>