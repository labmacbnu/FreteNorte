<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const route = useRoute()
const ambientes = useAmbientesStore()
const items = useItemsStore()

const selected = ref("")

const ambientes_filtrados = computed( () => {
    if(selected.value.length >= 3) {
        const regex = new RegExp(`.*${selected.value}.*`, 'i'); 
        return ambientes.dados.filter(
            obj => regex.test(obj.valor)
            );
    }
})


onBeforeMount(async () => ambientes.load_data())


</script>

<template>
    <h1>Items</h1>
    <p>Começe a digitar o nome do ambiente e selecione da lista que aparecer. Após, pressione o botão <em>Carregar</em> para listar os itens desse ambiente</p>
    <div class="input-group mb-3">
        <input class="form-control" v-model="selected" @focusout="load_on_input" type="text" list="ambientesList">
        <button class="btn btn-primary" @click="items.load_data">Carregar</button>
    </div>

    <ul id="ambientesList">
        <li v-for="x in ambientes_filtrados">
           <RouterLink @click="() => items.ambiente = x.valor" :to="{name: 'items-ambiente', params: {ambiente: x.ambiente_codigo}}">{{ x.valor }}</RouterLink>
        </li>
    </ul>
  <RouterView :key="route.path"></RouterView>
</template>
