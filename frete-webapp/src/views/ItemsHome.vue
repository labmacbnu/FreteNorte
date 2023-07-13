<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsAmbienteStore, useDescricoesStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useUserPermissionsStore } from '../stores/user';
 
const ambientes = useAmbientesStore() 
const permissions = useUserPermissionsStore()
const descricoes = useDescricoesStore()


const ambiente_search = ref("")
 
const main_focus = ref(null)

const ambientes_filtrados = computed(() => {
    if (ambiente_search.value.length >= 3) {
        const regex = new RegExp(`.*${ambiente_search.value}.*`, 'i');
        return ambientes.dados.filter(
            obj => regex.test(obj.valor)
        );
    }
})

const descricao_search = ref("")
 

const descricao_filtrados = computed(() => {
    if (descricao_search.value.length >= 3) {
        const regex = new RegExp(`.*${descricao_search.value}.*`, 'i');
        return descricoes.short_descricoes.filter(
            obj => regex.test(obj)
        );
    }
})

const meus_ambientes = computed( () => {
    return ambientes.dados.filter( obj =>  permissions.ambientes.includes(obj.ambiente_codigo))

})

</script>


<template>
    <div class="row">
        <div class="col">
            <h1>Items</h1>
    <h2>Seus ambientes</h2> 
    <div class="my-3">
        <p v-for="x in meus_ambientes">
        <RouterLink  :to="{ name: 'items-ambiente', params: { ambiente: x.ambiente_codigo } }">{{x.valor}}</RouterLink>
        </p>
    </div>
    <h3>Pesquisa por ambiente</h3>
    <p>Começe a digitar o nome do ambiente e clique em um link da lista que aparecer.  </p>
    <div class="input-group mb-3">
        <input @focusin="()=> main_focus = 'ambiente'" 
         class="form-control" v-model="ambiente_search" type="text">
    </div>

    <ul class="list-group" id="ambientesList" v-if="main_focus == 'ambiente'">

        <TransitionGroup name="list">
        <li class="list-group-item" v-for="x in ambientes_filtrados">
            <RouterLink 
                :to="{ name: 'items-ambiente', params: { ambiente: x.ambiente_codigo } }">
                {{ x.valor }}
            </RouterLink>
        </li>
        </TransitionGroup> 
    </ul> 

    <h3>Pesquisa por descrição</h3>
    <p>Começe a digitar uma descrição do item e clique em um item da lista que aparecer.  </p>
    <div class="input-group mb-3">
        <input @focusin="()=> main_focus = 'descricao'" 
         class="form-control" v-model="descricao_search" type="text">
    </div>

    <ul class="list-group" id="descricaoList" v-if="main_focus == 'descricao'">
        <TransitionGroup name="list">
        <li class="list-group-item" v-for="x in descricao_filtrados"> 
            <RouterLink 
             :to="{ name: 'item-descricao', query: { descricao: x } }">  
                {{ x }}
            </RouterLink>
        </li>
        </TransitionGroup>
    </ul> 

        </div>
    </div>
    

</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
} 
</style>