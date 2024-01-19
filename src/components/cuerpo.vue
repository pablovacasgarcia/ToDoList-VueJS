<script setup>
    import { useCollection } from 'vuefire'
    import { collection,addDoc, deleteDoc,doc, updateDoc } from 'firebase/firestore'
    import { useFirestore, } from 'vuefire';
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { computed, ref } from "vue";

    const atributos = defineProps(['notas'])
    const db = useFirestore();

    function marcarHecha(id, hecha) {
        updateDoc(doc(db,"todos",id),{
            hecha: !hecha
        });
    }

    function borrarNota(id){
        deleteDoc(doc(db,"todos", id));
    }

    function cambiarPrioridad(id, prioridad){
        updateDoc(doc(db,"todos",id),{
            prioridad: prioridad
        });
    }
    
    let usuario=getAuth().currentUser;

    
    const filtroNombre = ref('');

    const notasOrdenadas = computed(() => {
        const filtro = filtroNombre.value.toLowerCase();
        return [...atributos.notas].sort((a, b) => b.prioridad - a.prioridad).filter(item => item.texto.toLowerCase().includes(filtro));
    });

    const notasPendientes = computed(() => {
        return notasOrdenadas.value.filter(item => !item.hecha).length;
    });

    function borrarCompletadas() {
        const completadas = notasOrdenadas.value.filter(item => item.hecha);
        completadas.forEach(async item => {
        await deleteDoc(doc(db, "todos", item.id));
        });
    }

    async function descargarAdjuntos(adjuntos) {
        adjuntos.forEach(adjunto => {
            window.open(adjunto, '_blank');
        });
    }
    
</script>
<template>
    <div class="buscar">
        <h2>Notas de {{ usuario.displayName }}</h2>
        <p>Hay {{ notasPendientes }} notas pendientes de {{ notasOrdenadas.length }} notas</p>
    </div>
    
    <div class="buscar">
        <input v-model="filtroNombre" placeholder="Buscar por nombre">
        <p @click="borrarCompletadas" class="borrarTareas">Borrar las tareas completadas</p>
    </div>
    <ul>
            <li v-for="(item, pos) in notasOrdenadas" :key="pos">
                <div class="checkbox-wrapper-31">
                    <input type="checkbox" @click="marcarHecha(item.id, item.hecha)" v-model="item.hecha">
                    <svg viewBox="0 0 35.6 35.6">
                      <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                      <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                      <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                    </svg>
                </div>
                
                <div>
                    <span :class="{ hecha: item.hecha }">{{ item.texto }}</span>
                    <div>
                        Prioridad: 
                        <div>
                            <button @click="cambiarPrioridad(item.id, 0)" :class="{prioridad: item.prioridad==0}">Baja</button>
                            <button @click="cambiarPrioridad(item.id, 1)" :class="{prioridad: item.prioridad==1}">Media</button>
                            <button @click="cambiarPrioridad(item.id, 2)" :class="{prioridad: item.prioridad==2}">Alta</button>
                        </div>
                    </div>
                </div>
                <div>
                    <img src="../../public/img/64155-now-computer-button-icons-download-hq-png.png" @click="descargarAdjuntos(item.adjunto)">
                    <img src="../../public/img/borrar.png" @click="borrarNota(item.id)" class="borrar">
                </div>
                
            </li>
        </ul>
</template>
