import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import pendaftaranTutor from './pendaftaranTutor.vue'
import { create } from 'naive-ui'

createApp(App).mount('#app')
createApp(pendaftaranTutor).mount('#pendaftaranTutor')
