<script setup>
    import { useRouter } from 'vue-router';
    import { getAuth } from "firebase/auth";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
    import { ref } from 'vue';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

    const router = useRouter();
    let sesion=ref(null);

    let registrarse=ref(false);
    let displayName=ref("");
    let email=ref("");
    let password=ref("");
    let password2=ref("");

    function registro() {
        if (password.value === password2.value) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;

                    // Establecer el displayName
                    updateProfile(auth.currentUser, {
                        displayName: displayName.value
                    }).catch((error) => {
                        console.log("Error al establecer el displayName:", error);
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    // Manejar el error al crear el usuario
                });
        }
    }


    function iniciarSesion() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
    }

    function iniciarSesionGoogle()
    {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                sesion = user.displayName;
                router.push("/notas")
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    function cerrarSesion(){
        const auth = getAuth();
        signOut(auth).then(() => {
            sesion=null;
            console.log(sesion)
        }).catch((error) => {
            console.log("Error al cerrar sesión")
        });
    }
</script>
<template>
    <main id="contenedor">
        <img src="../../public/img/portada.png" alt="portada">
        <h1>Bienvenido</h1>

        <input v-if="registrarse" type="text" name="nombre" id="nombre" v-model="displayName" placeholder="Nombre Completo">
        <input type="text" name="correo" id="correo" v-model="email" placeholder="Correo Electrónico">
        <input type="password" name="contraseña" id="contraseña" v-model="password" placeholder="Contraseña">
        <input v-if="registrarse" type="password" name="contraseña2" id="contraseña2" v-model="password2" placeholder="Repita la Contraseña">

        <button v-if="!registrarse" @click="iniciarSesion" id="login">Iniciar Sesión</button>
        <button v-if="registrarse" @click="registro" id="login">Registrarse</button>
        <button @click="iniciarSesionGoogle" id="login">Iniciar Sesión con Google</button>
        <button v-if="registrarse" @click="registrarse=false" id="login">Iniciar Sesión</button>
        <button v-if="!registrarse" @click="registrarse=true" id="login">Registrarse</button>
    </main>
</template>
<style>
    #correo, #contraseña, #nombre, #contraseña2, #login{
        margin: 10px;
        padding: 0 !important;
        border: 1px solid gray;
        width: 100%;
        text-align: center;
    }

    #contenedor{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 100%;
    }

    #contenedor>*{
        width:400px !important;
        height: 40px !important;
    }

    #contenedor>img{
        width: 30% !important;
        height: 30% !important;
    }
</style>