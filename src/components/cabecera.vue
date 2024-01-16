<script setup>
    import {ref} from "vue";
    import { useRouter } from 'vue-router';
    import { getAuth } from "firebase/auth";
    import { signOut } from "firebase/auth";

    const evento = defineEmits(['nuevanota']);
    let nota=ref("");

    function nuevaNota(event){
        if(nota.value!=""){
            evento('nuevanota', nota.value)
        }

        nota.value="";
    }

    let buscarSiNo=false;

    const router = useRouter();
    function cerrarSesion(){
        const auth = getAuth();
        signOut(auth).then(() => {
            router.push("/")
        }).catch((error) => {
            console.log("Error al cerrar sesión")
        });
    }
</script>

<template>
    <p>
        <input type="text" v-model="nota" @keyup.enter="nuevaNota">
        <button @click="nuevaNota">Nueva nota</button>
        <button @click="cerrarSesion" style="width: 100px; height: 35px;">Cerrar Sesión</button>
    </p>
    <div class="buscar" v-if="buscarSiNo">
        <input type="text" v-model="filtro" placeholder="Buscar notas">
    </div>
</template>