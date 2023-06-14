<script setup>
import { onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsStore } from '../stores/items'

const ambientes = useAmbientesStore() 
const items = useItemsStore()

const selected = ref("Bossa")
</script>

<template> 
Items

<input v-model="items.ambiente" type="text" list="ambientesList">

<datalist id="ambientesList">
    <option v-for="x in ambientes.dados">{{ x.valor }}</option>
</datalist> 

<p>{{ selected }}</p>


<h2>{{items.ambiente}}</h2>
<button @click="items.load_data">Carregar</button>
<ul>
    <li v-for="(item, n) in items.dados">{{item.short_descricao}}</li>
</ul>

</template>
