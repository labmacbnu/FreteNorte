<script setup>
import { useRoute } from 'vue-router';
import { useCollection } from 'vuefire';
import { db } from '@/backend/index';
import { query, where, collection } from 'firebase/firestore';
import { computed, inject } from 'vue';
import moment from 'moment'


const {globaluser, updateUser} = inject('globaluser')
const user_label = computed(() => `${globaluser.value.displayName} <${globaluser.value.email}>` )
const route = useRoute()

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

</script>
<template>
    <h2>Criando um lote</h2> 
    <div class="row">
        <div class="col-6 mb-2">
            <label for="data_criacao" class="form-label">Data criação</label>
            <input disabled id="data_criacao" :value="hoje"  type="date" class="form-control">
        </div>
        <div class="col-6  mb-2">
            <label for="responsavel" class="form-label">Responsável</label>
            <input disabled id="responsavel" :value="user_label"  class="form-control">
        </div>
        <div class="col-6  mb-2">
            <label for="data_pronto" class="form-label">Data pronto</label>
            <input id="data_pronto" type="date"  class="form-control">
        </div>
        <div class="col-6  mb-2">
            <label for="localizacao" class="form-label">Localização</label>
            <input id="localizacao" type="text"  class="form-control">
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