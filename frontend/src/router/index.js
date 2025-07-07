import { createRouter, createWebHistory } from 'vue-router'
import Main from '../Main.vue';
import Home from '../Home.vue'; 
import TentangKami from '../TentangKami.vue';
import DetailProgram from '../detailProgram.vue';

import Program from '@/components/listProgram/program.vue'
import programBelajar from '../components/detailProgram/program.vue'
import PemesananProgram from '../components/detailProgram/PemesananProgram.vue';

import PendaftaranTutor from '../pendaftaranTutor.vue';
import AbsenSiswa from '../components/Absen.vue';

import Otp from '@/components/Auth/otp.vue';
import ResetPassword from '@/components/Auth/ResetPassword.vue';
import ResetPasswordEmail from '@/components/Auth/ResetPassword_Email.vue';
import ResetPasswordPass from '@/components/Auth/ResetPassword_Password.vue';

import Jadwal from '@/components/Jadwal.vue';
import TabelJadwal from '@/components/jadwal/TabelJadwal.vue'
import DetailJadwal from '@/components/jadwal/DetailJadwal.vue'

import ProfileUser from '@/components/ProfileUser.vue'
import User from '@/components/Profile/User.vue'
import EditProfile from '@/components/Profile/EditProfile.vue'
import EditProfileTutor from '@/components/Profile/EditProfileTutor.vue'
import Rekap from '@/components/rekap.vue'
import GoogleSuccess from '@/components/Auth/GoogleSuccess.vue';

import Dashboardadmin from '@/components/Dashboard/DashboardParent.vue';
import HomeAdmin from '@/components/Dashboard/dashboard.vue';

import Siswa from '@/components/Dashboard/dashboardSiswa/siswa.vue';
import siswaMain from '@/components/Dashboard/dashboardSiswa/siswaMain.vue';
import DetailSiswa from '@/components/Dashboard/dashboardSiswa/siswaDetail.vue';
import EditProfileSiswa from '@/components/Dashboard/dashboardSiswa/editProfileForm.vue';
import TambahSiswa from '@/components/Dashboard/dashboardSiswa/tambahSiswa.vue';

import Tutor from '@/components/Dashboard/dashboardTutor/Tutor.vue';
import TutorMain from '@/components/Dashboard/dashboardTutor/TutorMain.vue';
import TambahTutor from '@/components/Dashboard/dashboardTutor/TambahTutor.vue';
import EditTutor from '@/components/Dashboard/dashboardTutor/TutorEditForm.vue';
import TutorProfile from '@/components/Dashboard/dashboardTutor/TutorProfile.vue';
import VerifikasiTutor from '@/components/Dashboard/dashboardTutor/TutorVerification.vue';

import JadwalAdmin from '@/components/Dashboard/dashboardJadwal/jadwal.vue';

import ProgramAdmin from '@/components/Dashboard/dashboardProgram/ProgramAdmin.vue';
import ProgramMain from '@/components/Dashboard/dashboardProgram/ProgramMain.vue';
import ProgramAdd from '@/components/Dashboard/dashboardProgram/ProgramAdd.vue';

import CatatanBiaya from '@/components/Dashboard/dashboardCatatanBiaya/CatatanBiaya.vue';

import Error404 from '@/components/error404.vue';
import Error403 from '@/components/error403.vue';


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
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: Error404
      },
      {
        path: '/error403',
        name: 'Error403',
        component: Error403
      },
      { 
        path: 'detailprogram/:id', 
        name: 'DetailProgram', 
        component: DetailProgram,
        children: [
          {
            path: '',
            name: 'ProgramBelajar',
            component: programBelajar
          },
          {
            path: 'pemesananprogram',
            name: 'PemesananProgram',
            component: PemesananProgram
          }
        ]
      },
      { path: 'tentangkami', 
        name: 'TentangKami', 
        component: TentangKami 
      },
      { path: 'program', 
        name: 'Program', 
        component: Program 
      },
      { path: 'pendaftarantutor', 
        name: 'Menjadi Tutor', 
        component: PendaftaranTutor 
      },
      { path: 'absen', 
        name: 'Absen', 
        component: AbsenSiswa 
      },
      { path: 'rekap', 
        name: 'Rekap', 
        component: Rekap 
      },
    ]
  },
  {
    path: '/otp', 
    component: Otp,
  },
  {
    path: '/resetpassword', 
    component: ResetPassword,
    children: [
      {
        path: '',
        name: 'ResetPasswordEmail', 
        component: ResetPasswordEmail
      },
      {
        path: 'passwordbaru',
        name: 'ResetPasswordPass', 
        component: ResetPasswordPass
      }
    ]
  },
  {
    path: '/jadwal', 
    component: Jadwal,
    children: [
      {
        path: '', 
        name: 'tabeljadwal', 
        component: TabelJadwal,
      },
    ]
  },
  {
    path: '/detailjadwal/:slug', 
    component: DetailJadwal,
  },
  {
    path: '/google/success',
    component: GoogleSuccess
  },
  { 
    path: '/profileuser', 
    component: ProfileUser,
    children: [
      {
        path: '', 
        name: 'User', 
        component: User,
      },
      { 
        path: 'editprofile', 
        name: 'EditProfile', 
        component: EditProfile 
      },
      { 
        path: 'editprofiletutor', 
        name: 'EditProfileTutor', 
        component: EditProfileTutor
      },
    ]
  },
  {
    path: '/dashboardadmin', 
    component: Dashboardadmin,
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'HomeAdmin',
        component: HomeAdmin,
      },
      {
        path: 'siswa',
        name: 'Siswa',
        component: Siswa,
        children: [
          {
            path: '',
            name: 'siswaMain',
            component: siswaMain,
          },
          {
            path: ':id',
            name: 'DetailSiswa',
            component: DetailSiswa,
          },
          {
            path: 'edit/:id',
            name: 'EditProfileSiswa',
            component: EditProfileSiswa,
          },
          {
            path: 'tambahsiswa',
            name: 'TambahSiswa',
            component: TambahSiswa,
          },
        ]
      },
      {
        path: 'tutor',
        name: 'Tutor',
        component: Tutor,
        children: [
          {
            path: '',
            name: 'TutorMain',
            component: TutorMain
          },
          {
            path: 'tambahtutor',
            name: 'TambahTutor',
            component: TambahTutor
          },
          {
            path: 'profiltutor/:id',
            name: 'TutorProfile',
            component: TutorProfile
          },
          {
            path: 'edittutor/:id',
            name: 'EditTutor',
            component: EditTutor
          },
          {
            path: 'verifikasitutor',
            name: 'VerifikasiTutor',
            component: VerifikasiTutor
          },
        ]
      },
      {
        path: 'programadmin',
        name: 'ProgramAdmin',
        component: ProgramAdmin,
        children: [
          {
            path: '',
            name: 'ProgramMain',
            component: ProgramMain,
          },
          {
            path: 'tambahprogram',
            name: 'ProgramAdd',
            component: ProgramAdd,
          },
        ]
      },
      {
        path: 'jadwal',
        name: 'JadwalAdmin',
        component: JadwalAdmin,
      },
      {
        path: 'catatanbiaya',
        name: 'CatatanBiaya',
        component: CatatanBiaya,
      },
    ]
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

 router.beforeEach((to, from, next) => {
   const userRole = localStorage.getItem('role'); // contoh: 'admin' atau 'user'

   // Cek jika ingin akses dashboardadmin tapi bukan admin
   if (to.path.startsWith('/dashboardadmin') && userRole !== 'admin') {
     next({ name: 'Error403' });
   } else {
     next();
   }
 });

export default router