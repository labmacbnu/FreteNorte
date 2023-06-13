<script setup>
import { onBeforeMount } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';

const ambientes = useAmbientesStore() 


</script>

<template> 
Items

<input type="text" list="ambientesList">

<datalist id="ambientesList">
    <option v-for="x in ambientes.dados">{{ x.valor }}</option>
</datalist> 

<button @click="ambientes.load_data">Carrega dados</button>


</template>
