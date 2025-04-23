import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Home.vue'; // Pastikan path ke komponen benar
import TentangKami from '../TentangKami.vue';
import DetailProgram from '../detailProgram.vue';
import PendaftaranTutor from '../pendaftaranTutor.vue';

const routes = [
  { path: '/', name: 'Beranda', component: Home },
  { path: '/detailprogram/:id', name: 'Detail Program', component: DetailProgram },
  { path: '/tentangkami', name: 'Tentang Kami', component: TentangKami },
  { path: '/pendaftarantutor', name: 'Menjadi Tutor', component: PendaftaranTutor },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router