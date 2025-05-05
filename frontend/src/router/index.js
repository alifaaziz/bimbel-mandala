import { createRouter, createWebHistory } from 'vue-router'
import Main from '../Main.vue';
import Home from '../Home.vue'; 
import TentangKami from '../TentangKami.vue';
import DetailProgram from '../detailProgram.vue';
import PendaftaranTutor from '../pendaftaranTutor.vue';
import AbsenSiswa from '../components/Absen.vue';

import MasukDaftar from '../MasukDaftar.vue'

const routes = [
  { 
    path: '/', 
    component: Main,
    children: [
      {
        path: '', 
        name: 'Beranda', 
        component: Home,
      },
      { 
        path: 'detailprogram/:id', 
        name: 'Detail Program', 
        component: DetailProgram 
      },
      { path: 'tentangkami', 
        name: 'Tentang Kami', 
        component: TentangKami 
      },
      { path: 'pendaftarantutor', 
        name: 'Menjadi Tutor', 
        component: PendaftaranTutor 
      },
      { path: 'absen', 
        name: 'Absen', 
        component: AbsenSiswa 
      },
      // { path: 'rekap', 
      //   name: 'Rekap', 
      //   component: RekapSiswa 
      // },
    ]
   },
   {
    path: '/MasukDaftar', 
    component: MasukDaftar,
   },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router