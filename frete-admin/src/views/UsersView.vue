<script setup>

import {onBeforeMount}  from 'vue';
import { useUsuariosStore } from '../stores/users';

const usuarios = useUsuariosStore()

onBeforeMount(async () => await usuarios.load_data())
</script>
<template>
<ul>
    <li v-for="(valor, chave) in usuarios.usuarios">
        <b>{{ chave }}</b>: {{ valor }}
    </li>
</ul>
</template>