<script setup>
  import cabecera from '../components/cabecera.vue';
  import cuerpo from '../components/cuerpo.vue';
  import { useCollection } from 'vuefire'
  import { collection, addDoc, query, where } from 'firebase/firestore'
  import { useFirestore } from 'vuefire';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

  const db = useFirestore();
  
  let usuario=getAuth().currentUser
  let todos;
  if(usuario.displayName=="Administrador"){
    todos = useCollection(collection(db, 'todos'))
  } else {
    todos = useCollection(query ((collection(db, 'todos')), where("idUsuario", "==", usuario.uid)))
  }

  let files = [];

  function reciboNuevaNota(nota){
    let enlaces=[];
    const storage = getStorage();


    for (let i=0; i<files.length; i++){
      const storageRef = ref(storage, files[i].name);

      uploadBytes(storageRef, files[i]).then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      }).then(downloadURL => {
        enlaces.push(downloadURL);

        if(enlaces.length==files.length){
          const docRef = addDoc(collection(db, "todos"),{
            idUsuario : usuario.uid,
            texto : nota,
            prioridad : 1,
            hecha : false,
            adjunto : enlaces
          });
          files = null;
        }
      })
    };

    
  }

  function subirAdjunto(e){
    files = e.target.files;
  }

</script>

<template>
  <header>
   
    <div class="wrapper">
      <cabecera @nuevanota="reciboNuevaNota"></cabecera>
    </div>
    
  </header>
  <div class="adjunto">
    <input type="file" @change="subirAdjunto($event)" multiple>
  </div>

  <main>
    <cuerpo :notas="todos"></cuerpo>
  </main>
</template>

<style>
.hecha{
    text-decoration: line-through;
    color: #6cbe45;
}

h2{
  text-align: center;
}

li{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 15px;
    border: 2px solid black;
    border-radius: 10px;
    width: 80%;
    box-shadow: 1px 1px 10px black;
    padding: 5px;
    padding-top:15px;
    font-size: 120%;
    font-family: 'Courier New', Courier, monospace;
    align-items: center;
    color: black;
}


li>div>span{
    font-weight: bold;
    transition: all 1s ease;
}

.prioridad{
    background-color: rgb(157, 242, 253);
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #f2f2f2;
    margin: 0;
    padding: 0;
}

#app {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

p {
    margin-bottom: 10px;
}

input[type="text"] {
    padding: 8px;
    margin-right: 10px;
    border-radius: 5px;
    width: 40%;
}

p>button:first-of-type{
    padding: 10px;
}

p{
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    cursor: pointer;
    background-color: #6cbe45;
    color: #fff;
    border: none;
    border-radius: 4px;
    margin: 5px;
}

button.prioridad {
    background-color: #2196F3;
}

ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

input[type="checkbox"] {
    margin-right: 5px;
}

button.borrar {
    background-color: #e74c3c;
}

.checkbox-wrapper-31:hover .check {
    stroke-dashoffset: 0;
  }
  
  .checkbox-wrapper-31 {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  
  .checkbox-wrapper-31 .background {
    fill: #ccc;
    transition: ease all 0.6s;
    -webkit-transition: ease all 0.6s;
  }
  
  .checkbox-wrapper-31 .stroke {
    fill: none;
    stroke: #fff;
    stroke-miterlimit: 10;
    stroke-width: 2px;
    stroke-dashoffset: 100;
    stroke-dasharray: 100;
    transition: ease all 0.6s;
    -webkit-transition: ease all 0.6s;
  }
  
  .checkbox-wrapper-31 .check {
    fill: none;
    stroke: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
    stroke-dashoffset: 22;
    stroke-dasharray: 22;
    transition: ease all 0.6s;
    -webkit-transition: ease all 0.6s;
  }
  
  .checkbox-wrapper-31 input[type=checkbox] {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    margin: 0;
    opacity: 0;
    appearance: none;
    -webkit-appearance: none;
  }
  
  .checkbox-wrapper-31 input[type=checkbox]:hover {
    cursor: pointer;
  }
  
  .checkbox-wrapper-31 input[type=checkbox]:checked + svg .background {
    fill: #6cbe45;
  }
  
  .checkbox-wrapper-31 input[type=checkbox]:checked + svg .stroke {
    stroke-dashoffset: 0;
  }
  
  .checkbox-wrapper-31 input[type=checkbox]:checked + svg .check {
    stroke-dashoffset: 0;
  }

  .buscar {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .buscar input{
    width: 30%;
    height: 30px;
    text-align: center;
    border-radius: 10px;
  }

  img{
    width: 30px;
    height: 30px;
    margin-left: 20px;
    transition: transform 0.5s ease;
  }

  img:hover{
    transform: scale(120%);
    cursor: pointer;
  }

  .borrarTareas{
    color: #e74c3c;
  }

  .borrarTareas:hover{
    cursor: pointer;
    color: #91261a;
  }

  .adjunto {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  

/* Responsive Styles */
@media screen and (max-width: 600px) {
    #app {
        width: 90%;
    }

    li>div:last-child>div{
      display: flex;
      flex-direction: row;
    }
}

</style>
