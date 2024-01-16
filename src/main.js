import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

import router from './router'

app.use(router)


app.mount('#app')