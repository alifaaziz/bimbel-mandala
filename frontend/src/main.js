import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import TentangKami from './TentangKami.vue'
import detailProgram from './detailProgram.vue'

createApp(App).mount('#app')
createApp(TentangKami).mount('#tentangkami')
createApp(detailProgram).mount('#detailprogram')
