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
        stroke-linecap="round"
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
        stroke-linecap="round"
      />
    </svg>
    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colorAktif }"></span>
        <div class="legend-text-group">
          <span class="legend-value">{{ programAktif }} Program</span>
          <span class="legend-label">Aktif</span>
        </div>
      </div>
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colorDibuka }"></span>
        <div class="legend-text-group">
          <span class="legend-value">{{ programDibuka }} Program</span>
          <span class="legend-label">Dibuka</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonutChart',
  props: {
    programAktif: {
      type: Number,
      required: true,
      default: 15,
    },
    programDibuka: {
      type: Number,
      required: true,
      default: 85,
    },
    colorAktif: {
      type: String,
      default: '#1e3a8a', // Biru Tua (sesuai gambar)
    },
    colorDibuka: {
      type: String,
      default: '#f97316', // Oranye (sesuai gambar)
    },
    containerWidth: {
      type: [String, Number],
      default: 220, // Lebar container keseluruhan
    },
    containerHeight: {
      type: [String, Number],
      // default: 280, // Tinggi bisa otomatis atau diset jika perlu
    },
    strokeWidth: {
      type: Number,
      default: 18, // Ketebalan ring donat
    },
    svgSize: { // Ukuran internal viewBox SVG, untuk skala
        type: Number,
        default: 100, // Ukuran viewBox (misal 100x100)
    }
  },
  computed: {
    center() {
      return this.svgSize / 2; // Titik tengah SVG
    },
    radius() {
      // Radius dihitung agar strokeWidth terpusat dan ada sedikit padding dari tepi viewBox
      return (this.svgSize / 2) - (this.strokeWidth / 2) - (this.svgSize * 0.02); // 2% padding
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
    // --- Kalkulasi untuk Segmen Aktif (Biru) ---
    strokeDashArrayAktif() {
      // Panjang goresan untuk segmen Aktif, sisanya adalah gap
      const dashLength = this.percentAktif * this.circumference;
      return `${dashLength} ${this.circumference}`;
    },
    transformAktif() {
      // Mulai dari atas (jam 12), yaitu -90 derajat rotasi
      return `rotate(-90 ${this.center} ${this.center})`;
    },
    // --- Kalkulasi untuk Segmen Dibuka (Oranye) ---
    strokeDashArrayDibuka() {
      // Panjang goresan untuk segmen Dibuka
      const dashLength = this.percentDibuka * this.circumference;
      return `${dashLength} ${this.circumference}`;
    },
    transformDibuka() {
      // Mulai setelah segmen Aktif berakhir.
      // Segmen Aktif mencakup (percentAktif * 360) derajat.
      // Jadi, segmen Dibuka dimulai dari rotasi -90 + (derajat segmen Aktif).
      const rotationAngle = (this.percentAktif * 360) - 90;
      return `rotate(${rotationAngle} ${this.center} ${this.center})`;
    }
  },
};
</script>

<style scoped>
.donut-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: #fff;
  border-radius: 20px; /* Sesuai lengkungan kartu pada gambar */
  padding: 20px 15px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); /* Shadow halus */
  width: var(--chart-width, 220px); /* Menggunakan CSS variable untuk lebar, default 220px */
  box-sizing: border-box;
}

.donut-svg {
  display: block;
  margin-bottom: 20px; /* Jarak antara chart dan legenda */
  max-width: 100%; /* Agar SVG responsif di dalam container */
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
  font-size: 1rem; /* Sekitar 16px */
  font-weight: 600; /* Bold seperti di gambar */
  color: #2c3e50; /* Warna teks gelap */
  line-height: 1.3;
}

.legend-label {
  font-size: 0.875rem; /* Sekitar 14px */
  color: #7f8c8d; /* Warna teks abu-abu */
  line-height: 1.3;
}
</style>