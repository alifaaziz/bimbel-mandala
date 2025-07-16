<template>
  <div class="donut-chart-container">
    <svg :viewBox="`0 0 ${svgSize} ${svgSize}`" :width="containerWidth" :height="containerHeight" class="donut-svg">
      <circle
        v-if="percentDibuka > 0"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="colorDibuka"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArrayDibuka"
        :transform="transformDibuka"
      />
      <circle
        v-if="percentAktif > 0"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="colorAktif"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArrayAktif"
        :transform="transformAktif"
      />
    </svg>
    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colorAktif }"></span>
        <div class="legend-text-group">
          <span class="bodym2 legend-value">{{ programAktif }} Program</span>
          <span class="bodyr3 legend-label">Aktif</span>
        </div>
      </div>
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colorDibuka }"></span>
        <div class="legend-text-group">
          <span class="bodym2 legend-value">{{ programDibuka }} Program</span>
          <span class="bodyr3 legend-label">Dibuka</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonutChart',
  props: {
    colorAktif: {
      type: String,
      default: '#1e3a8a', // Biru Tua
    },
    colorDibuka: {
      type: String,
      default: '#f97316', // Oranye
    },
    containerWidth: {
      type: [String, Number],
      default: 220,
    },
    containerHeight: {
      type: [String, Number],
    },
    strokeWidth: {
      type: Number,
      default: 18,
    },
    svgSize: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      programAktif: 0, // Nilai awal
      programDibuka: 0, // Nilai awal
    };
  },
  computed: {
    center() {
      return this.svgSize / 2;
    },
    radius() {
      return (this.svgSize / 2) - (this.strokeWidth / 2) - (this.svgSize * 0.02);
    },
    totalPrograms() {
      return this.programAktif + this.programDibuka;
    },
    percentAktif() {
      if (this.totalPrograms === 0) return 0;
      return this.programAktif / this.totalPrograms;
    },
    percentDibuka() {
      if (this.totalPrograms === 0) return 0;
      return this.programDibuka / this.totalPrograms;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    strokeDashArrayAktif() {
      const dashLength = this.percentAktif * this.circumference;
      return `${dashLength} ${this.circumference}`;
    },
    transformAktif() {
      return `rotate(-90 ${this.center} ${this.center})`;
    },
    strokeDashArrayDibuka() {
      const dashLength = this.percentDibuka * this.circumference;
      return `${dashLength} ${this.circumference}`;
    },
    transformDibuka() {
      const rotationAngle = (this.percentAktif * 360) - 90;
      return `rotate(${rotationAngle} ${this.center} ${this.center})`;
    },
  },
  methods: {
    async fetchStatistics() {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login kembali.');
        }
        const response = await fetch('http://localhost:3000/users/statistics', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        this.programAktif = result.data.activePackageCount; // Isi programAktif
        this.programDibuka = result.data.packageCount; // Isi programDibuka
      } catch (error) {
        console.error('Error fetching statistics:', error);
        alert('Gagal mengambil data statistik.');
      }
    },
  },
  mounted() {
    this.fetchStatistics(); // Panggil fetch saat komponen dimuat
  },
};
</script>

<style scoped>
.donut-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 12px; /* Sesuai lengkungan kartu pada gambar */
  padding: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); /* Shadow halus */
  width: 288px;
  box-sizing: border-box;
}

.donut-svg {
  display: block;
  margin-bottom: 20px; /* Jarak antara chart dan legenda */
  width: 70%; /* Agar SVG responsif di dalam container */
  height: auto; /* Menjaga rasio aspek SVG */
}

.legend {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.legend-item {
  display: flex;
  flex-direction: column; /* Dot di atas, teks di bawah */
  align-items: center;
  text-align: center;
}

.legend-dot {
  width: 14px; /* Ukuran dot */
  height: 14px;
  border-radius: 50%;
  margin-bottom: 8px; /* Jarak dot ke teks */
}

.legend-text-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.legend-value {
  color: #061222; /* Warna teks gelap */
  line-height: 1.3;
}

.legend-label {
  color: #7f8c8d; /* Warna teks abu-abu */
  line-height: 1.3;
}

@media (max-width: 768px) {
 .donut-chart-container {
    max-width: 100%;
  }
}
</style>