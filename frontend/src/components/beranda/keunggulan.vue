<script>
import { NRow, NCol } from 'naive-ui';

export default {
  components: {
    NRow,
    NCol,
  },
};
</script>

<script setup>
import buttonProfile from '../dirButton/butProfile.vue'
</script>

<template>
    <h1 class="headerr2">Mengapa pilih Kami?</h1>
    <h2 class="headerb1">Keunggulan</h2>

    <n-row gutter="12" class="row">
        <n-col :span="6">
            <div class="icon-wrapper">
                <img src="../../assets/check.svg" alt="checklist" class="checklist" />
            </div>
            <h3 class="headersb3">Tutor Berkualitas</h3>
            <p class="bodyr2">
                Tim pengajar Mandala terdiri dari para profesional dan akademisi 
                terbaik yang tidak hanya menguasai materi, tetapi juga terlatih dalam 
                teknik mengajar modern.
            </p>
        </n-col>
        <n-col :span="6">
            <div class="icon-wrapper">
                <img src="../../assets/check.svg" alt="checklist" class="checklist" />
            </div>
            <h3 class="headersb3">Tutor Berkualitas</h3>
            <p class="bodyr2">
                Tim pengajar Mandala terdiri dari para profesional dan akademisi 
                terbaik yang tidak hanya menguasai materi, tetapi juga terlatih dalam 
                teknik mengajar modern.
            </p>
        </n-col>
        <n-col :span="6">
            <div class="icon-wrapper">
                <img src="../../assets/check.svg" alt="checklist" class="checklist" />
            </div>
            <h3 class="headersb3">Tutor Berkualitas</h3>
            <p class="bodyr2">
                Tim pengajar Mandala terdiri dari para profesional dan akademisi 
                terbaik yang tidak hanya menguasai materi, tetapi juga terlatih dalam 
                teknik mengajar modern.
            </p>
        </n-col>
        <n-col :span="6">
            <div class="icon-wrapper">
                <img src="../../assets/check.svg" alt="checklist" class="checklist" />
            </div>
            <h3 class="headersb3">Tutor Berkualitas</h3>
            <p class="bodyr2">
                Tim pengajar Mandala terdiri dari para profesional dan akademisi 
                terbaik yang tidak hanya menguasai materi, tetapi juga terlatih dalam 
                teknik mengajar modern.
            </p>
        </n-col>
    </n-row>
    <buttonProfile class="button"/>
</template>

<style scoped>
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.checklist {
  width: 50px;
  height: 50px;
  align-content: center;
}

.row {
    padding: 0 8rem;
}

@media (max-width: 964px) {
    .row {
        padding: 0 2rem;
    } 
  }

</style>

<style>
h1 {
    color: #FDC998;
    text-align: center;
}
h2 {
    color: #154484;
    text-align: center;
    margin-bottom: 12px;
}
h3 {
    color: #154484;
    text-align: center;
    margin-bottom: 4px;
}
p {
    color: #9BAFCB;
    text-align: justify;
    padding: 0rem 1rem;
}
.button{
    margin-top: 2rem;
}
</style>