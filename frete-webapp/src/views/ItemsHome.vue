<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useUserPermissionsStore } from '../stores/user';

const route = useRoute()
const ambientes = useAmbientesStore()
const items = useItemsStore()
const permissions = useUserPermissionsStore()


const selected = ref("")

const ambientes_filtrados = computed(() => {
    if (selected.value.length >= 3) {
        const regex = new RegExp(`.*${selected.value}.*`, 'i');
        return ambientes.dados.filter(
            obj => regex.test(obj.valor)
        );
    }
})

const meus_ambientes = computed( () => {
    return ambientes.dados.filter( obj =>  permissions.ambientes.includes(obj.ambiente_codigo))

})


</script>


<template>
    <h1>Items</h1>
    <h2>Seus ambientes</h2> 
    <div class="my-3">
        <p v-for="x in meus_ambientes">
        <RouterLink  :to="{ name: 'items-ambiente', params: { ambiente: x.ambiente_codigo } }">{{x.valor}}</RouterLink>
        </p>
    </div>
    <h3 >Pesquisa por ambiente</h3>
    <p>Começe a digitar o nome do ambiente e selecione da lista que aparecer. Após, pressione o botão <em>Carregar</em> para
        listar os itens desse ambiente</p>
    <div class="input-group mb-3">
        <input class="form-control" v-model="selected" @focusout="load_on_input" type="text" list="ambientesList">
    </div>

    <ul class="list-group" id="ambientesList">
        <li class="list-group-item" v-for="x in ambientes_filtrados">
            <RouterLink 
                :to="{ name: 'items-ambiente', params: { ambiente: x.ambiente_codigo } }">
                {{ x.valor }}
            </RouterLink>
        </li>
    </ul> 


</template>