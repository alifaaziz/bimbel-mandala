import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import TentangKami from './TentangKami.vue'
import detailProgram from './detailProgram.vue'
import pendaftaranTutor from './pendaftaranTutor.vue'
import listProgram from './listprogram.vue'

createApp(App).mount('#app')
createApp(TentangKami).mount('#tentangkami')
createApp(detailProgram).mount('#detailprogram')
createApp(pendaftaranTutor).mount('#pendaftarantutor')
createApp(listProgram).mount('#listprogram')
