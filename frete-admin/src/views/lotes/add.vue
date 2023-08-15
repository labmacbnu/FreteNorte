<script setup>
import { useRoute, useRouter} from 'vue-router';
import { useCollection } from 'vuefire';
import { db } from '@/backend/index';
import { query, where, collection } from 'firebase/firestore';
import { computed, inject, onMounted, reactive, toValue, watch } from 'vue';
import SelectPlus from '@/components/SelectPlus.vue';
import { useListaAmbientesStore } from '@/stores/ambientes'
import { loteModel, save_lote } from '@/stores/lotes'
import moment from 'moment'


const new_lote = reactive(loteModel)

const {globaluser, updateUser} = inject('globaluser')
const user_label = computed(() => `${globaluser.value.displayName} <${globaluser.value.email}>` )

const route = useRoute()
const router = useRouter()

const volumes_list = route.query.volumes
 
  

const volumes_query = computed( () => {
    const volumesRef = collection(db, 'volumes')
    return query(volumesRef, where('codigo', 'in', volumes_list))
})

const volumes = useCollection(volumes_query, {maxRefDepth: 1})

function formata_data(data){
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY")
}

const hoje = computed(() => moment().format("YYYY-MM-DD"))


const all_ambientes = useListaAmbientesStore()

const todos_os_ambientes = computed(() => {
    return  all_ambientes.dados.map(amb => ({name: amb, id: amb})) 
 })

const carretamentos = [
    {name: 'Carregamento 1', id: 1, data: '2023-09-01'},
    {name: 'Carregamento 2', id: 2, data: '2023-09-10'},
    {name: 'Carregamento 3', id: 3, data: '2023-09-21'},
    {name: 'Carregamento 4', id: 4, data: '2023-09-30'},
] 

async function front_save_lote(){
    //console.log(toValue(new_lote)) 
    const valor = await save_lote({...new_lote})
    console.log(valor)
    router.push({name: 'lotes'})
}


onMounted(() => {
    new_lote.volumes = route.query.volumes
    new_lote.responsavel = globaluser.value.email
    new_lote.data_criacao = hoje.value
})
</script>
<template>
    <div class="d-flex justify-content-between">
    <h4 class="display-4">Criando um lote </h4> <button @click="front_save_lote" class=" fs-4 px-4 btn btn-success">Salvar</button>
    </div>
    <div class="row">
        <div class="col-6 mb-2">
            <label for="data_criacao" class="form-label">Data criação</label>
            <input disabled id="data_criacao" :value="hoje"  type="date" class="form-control">
        </div>
        <div class="col-6  mb-2">
            <label for="responsavel" class="form-label">Responsável</label>
            <input disabled id="responsavel" :value="user_label"  class="form-control">
        </div>
    </div>
    <div class="row">
        <div class="col">
            <h4>Carregamento</h4>
        </div>  
    </div>
    <div class="row">
        <div class="col-4  mb-2">
            <label for="carregamento" class="form-label">Carregamento</label>
            <SelectPlus placeholder="Selecione uma opção" :options="carretamentos" @selected="(c) => {new_lote.carregamento = c.name; new_lote.data_pronto = c.data }"></SelectPlus>
        </div>
        <div class="col-4  mb-2">
            <label for="data_pronto" class="form-label">Data despacho</label>
            <input v-model="new_lote.data_pronto" id="data_pronto" type="date"  class="form-control">
        </div>
        <div class="col-4  mb-2">
            <label for="localizacao" class="form-label">Local despacho</label>
            <SelectPlus placeholder="Selecione um ambiente" :options="todos_os_ambientes" @selected="(c) => new_lote.local_pronto = c.name"></SelectPlus>
        </div>
    </div>
    <div class=" my-2">
        <div class="col">
            <h4>Volumes desse lote</h4>
        </div>
    </div>
    <div class="row">
        <div class="col"   v-for="vol in volumes">
            <div  class="card m-1">
            <div class="card-header text-secondary">
            <small>{{ vol.codigo }}</small> 
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ vol.categoria }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ vol.origem.ambiente_codigo }}</h6>
                <p>Responsável: {{ vol.responsavel.nome }}</p>
                </div>
                <ul class="list-group list-group-flush">
    <li v-for="item in vol.items" class="text-lowercase list-group-item d-flex justify-content-between align-items-cente">
        {{item.short_descricao}} <span class="badge bg-secondary">{{ item.key }}</span></li> 
</ul> 
            <div class="card-footer text-end text-secondary">
                Criado {{formata_data(vol.data_criacao)}}
            </div> 
        </div>
        </div>
    </div>
     
</template>