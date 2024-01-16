import { createRouter, createWebHistory, onBeforeRouteUpdate } from 'vue-router'
import inicio from '../components/inicio.vue'
import privada from '../views/privada.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: inicio
    },
    
    {
      path: '/notas',
      name: 'notas',
      component: privada
    },
  ]
})

router.beforeEach((to, from)=>
{
  if(to.path=="/notas" && !estaLogeado){
    return false;
  }
})


let estaLogeado=false;
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    estaLogeado=true;
    router.push("notas")
  } else {
    // User is signed out
    estaLogeado=false;
  }
});

export default router
