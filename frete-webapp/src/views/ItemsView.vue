<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';

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

function load_on_input() { 
    items.ambiente = selected.value
    console.log(items.ambiente)
}

</script>

<template>
    <h1>Items</h1>
    <p>Começe a digitar o nome do ambiente e selecione da lista que aparecer. Após, pressione o botão <em>Carregar</em> para listar os itens desse ambiente</p>
    <div class="input-group mb-3">
        <input class="form-control" v-model="selected" @focusout="load_on_input" type="text" list="ambientesList">
        <button class="btn btn-primary" @click="items.load_data">Carregar</button>
    </div>

    <datalist id="ambientesList">
        <option v-for="x in ambientes_filtrados">{{ x.valor }}</option>
    </datalist>
  
    <h2>Lista de items desse ambiente</h2> 
    <div class="accordion" id="acordeao">
        <AcordeaoChild v-for="(valor, chave, n) in items.dados_agrupados" pai="acordeao" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <li class="list-group-item" v-for="subitem in valor">
                    {{ subitem.descricao }}
                </li>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>
