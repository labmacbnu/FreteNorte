<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesUserStore } from '@/stores/ambientes';
import { useItemsAmbienteStore, useDescricoesStore } from '@/stores/items'
import AcordeaoChild from '@/components/AcordeaoChild.vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useUserPermissionsStore } from '@/stores/user';
 
const permissions = useUserPermissionsStore()
const descricoes = useDescricoesStore()
const router = useRouter()


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


const codigo_search = ref("")

</script>


<template>
    <div class="row">
        <div class="col">
            <h1>Items</h1> 
        </div>
    </div>
    <div class="row mb-4">
        <div class="col text-center ">
            <RouterLink class="btn btn-lg btn-primary" :to="{ name: 'item-add' }"><i
            class="bi bi-plus-circle me-2"></i>Adicionar novo item</RouterLink> 
        </div>
    </div>
    <div class="row g-2"> 
        <div class="col border rounded p-2">
            <h3>Pesquisa por código de barras</h3>
            <p>Digite o código de barras e pesquise pelo item. </p>
            <div class="input-group mb-3">

                <input inputmode="numeric" class="form-control" v-model="codigo_search" type="text">
                <button class="btn btn-outline-primary" type="button" id="button-addon1"
                    @click="router.push({ name: 'item-codigo', params: { codigo: codigo_search } })">Pesquisar item</button>
            </div>
        </div>
         
    </div>
</template>

<style>
.list-move,
/* apply transition to moving elements */
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