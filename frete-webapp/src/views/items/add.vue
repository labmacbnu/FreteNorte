<script setup>
import { onBeforeMount, reactive, computed, ref, toValue, inject, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserPermissionsStore } from '@/stores/user'; 
import { cria_item } from '@/stores/items';
import { itemModel } from "@/stores/singleitem" 
import { query, where, collection } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { db } from '@/backend/index';

const route = useRoute();
const router = useRouter(); 
const permissions = useUserPermissionsStore();
const {globaluser, updateuser} = inject("globaluser")


const ambientes_query = computed( () => {
    const user_ambientes = [...permissions.ambientes, ...permissions.usuario_de]
    const ambientesRef = collection(db, 'ambientes')
    return query(ambientesRef, where('ambiente_codigo', 'in', user_ambientes))
})

const {data: meus_ambientes, pending: ambientes_pending} = useCollection(ambientes_query)


const item = reactive(itemModel)




const goBack = function(){
    if (route.query.ambiente) {
        router.push({name: 'items-ambiente', params: {ambiente: route.query.ambiente}})
    } else {
        router.push({name: 'items'})
    }
}

const valido = reactive({
    descricao: true,
    ambiente: true,
})

function validate(){
    valido.descricao = item.detalhes.descricao.length > 0
    valido.ambiente = item.ambiente != "" 
    return valido.descricao && valido.ambiente
}

async function saveItem() {
    const valid  = validate()
    if(valid) {
        const raw_item = toValue(item)
        console.log({...raw_item})
        const id = await cria_item(raw_item)
        if (id) {
            router.push({name: 'item-codigo', params: {codigo: id}})
        }
    } else {
        console.log("invalido")
        setTimeout( () => {
            valido.descricao = true
            valido.ambiente = true
        }, 2500)
    }
}

onBeforeMount(() => {
    if (route.query.ambiente) {
        item.ambiente = route.query.ambiente;
    }
}) 

watch( () => item.short_descricao, (newVal,oldVal) =>{
    item.detalhes.descricao = newVal
} )


watch( () => item.ambiente, (newVal,oldVal) =>{
    var ambiente_obj = meus_ambientes.value.find( x => x.ambiente_codigo == newVal)
    if(ambiente_obj)
        item.edificio = ambiente_obj.edificio
} )


onMounted( () => 
    Object.assign(item, {responsavel: globaluser.value.displayName})
)
</script>
<template>
    <div class="row">
        <div class="col">
            <h1>Adicionar item</h1> 
            <p class="form-text">Items adicionados aqui são items que não tem número de patrimônio, mas que você quer
                manter o controle durante o processo de mudança.</p> 
            
                <div class="row g-3 mb-2 justify-items-start">
                    <label for="ambiente" class="col-auto col-form-label me-3">Ambiente</label>
                    <div class="col">
                        <select v-model="item.ambiente" class="form-select" :class="{'border-danger': !valido.ambiente}" aria-label="Ambiente">
                            <option v-for="ambiente in meus_ambientes" :value="ambiente.ambiente_codigo">
                                {{ ambiente.ambiente_codigo }} - {{ ambiente.ambiente_nome }}
                            </option>
                            </select>

                    </div>
                </div>

                <div class="row g-3 mb-2 justify-items-start">
                    <div class="col">
                    <label class="form-label" for="descricao">Descrição</label>
                        <input :class="{'border-danger': !valido.descricao}" placeholder="Reagentes, Vidraria, Placas de Circuito, Tecidos, etc" type="text" class="form-control" id="descricao" v-model="item.short_descricao">
                        <p class="form-text">Descreva brevemente o item que está sendo catalogado.</p>
                    </div>
                </div>


                <div class="row g-3 mb-2 justify-items-start">
                    <div class="col-6">
                        <label for="medidas" class="form-label ">Medidas</label>
                        <input placeholder="L x A x P cm" type="text" class="form-control" id="medidas" v-model="item.detalhes.medidas">
                    </div>
                    <div class="col-6">
                        <label for="peso" class="form-label">Peso</label>
                        <input placeholder="xyz (g|kg)" type="text" class="form-control" id="peso" v-model="item.detalhes.peso">
                    </div>
                </div>

                <div class="row g-3 my-2 justify-items-start">
                    <div class="col">
                        <label for="patrimonio" class="form-label">Patrimônio</label>
                        <input placeholder="Se não existir, deixe em branco" type="number" class="form-control" id="patrimonio" v-model.number="item.detalhes.patrimonio">
                    </div>
                    <div class="col">
                        <label for="controle" class="form-label">Nº de Controle</label>
                        <input placeholder="Se não existir, deixe em branco" type="text" class="form-control" id="controle" v-model="item.detalhes.n_controle">
                    </div>
                    <div class="col">
                        <label for="serie" class="form-label">Nº de Série</label>
                        <input placeholder="Se não existir, deixe em branco" type="text" class="form-control" id="serie" v-model="item.detalhes.n_serie">
                    </div>
                    <div class="col">
                        <label for="barras" class="form-label">Código de Barras</label>
                        <input placeholder="Se não existir, deixe em branco" type="number" class="form-control" id="barras" v-model.number="item.detalhes.cod_barras">
                    </div>
                </div>

 
                <div class="row g-3 my-3 justify-items-end">
                    <div class="col"></div>
                    <div class="col-auto">
                        <button class="btn btn-secondary" 
                        @click="goBack">
                            Cancelar
                            </button>
                    </div>
                    <div class="col-auto">
                        <button @click="saveItem" class="btn btn-primary">
                            Salvar
                            </button>
                    </div>
                    </div>
        </div>
    </div>
    {{ item }}
</template>