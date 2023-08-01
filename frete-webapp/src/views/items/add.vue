<script setup>
import { onBeforeMount, reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserPermissionsStore } from '@/stores/user';
import { useAmbientesStore } from '@/stores/ambientes';
import { cria_item } from '@/stores/items';

const route = useRoute();
const router = useRouter();
const ambientes = useAmbientesStore();
const permissions = useUserPermissionsStore();

const meus_ambientes = computed( () => {
    return ambientes.dados.filter( obj =>  permissions.ambientes.includes(obj.ambiente_codigo))

})
const itemModel = reactive({
    key: "",
    descricao: "",
    short_descricao: "",
    categoria: "consumível",
    ambiente: "",
    medidas: null,
    peso: null,
    fragil: false,
    transporte_especial: false,
    inteiro: true,
    observacoes: "",
    volume: null,
})

const valido = reactive({
    descricao: true,
    ambiente: true,
})

const goBack = function(){
    if (route.query.ambiente) {
        router.push({name: 'items-ambiente', params: {ambiente: route.query.ambiente}})
    } else {
        router.push({name: 'items'})
    }
}

async function saveItem() {
    valido.descricao = itemModel.descricao.length > 0
    valido.ambiente = itemModel.ambiente != ""
    if(valido.descricao && valido.ambiente) {
        const item = {...itemModel} 
        item.short_descricao = item.descricao
        console.log(item)
        const id = await cria_item(item)
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
        itemModel.ambiente = route.query.ambiente;
    }
})
</script>
<template>
    <div class="row">
        <div class="col">
            <h1>Adicionar item</h1> 
            <p class="form-text">Items adicionados aqui são items que não tem número de patrimônio, mas que você quer
                manter o controle durante o processo de mudança.</p> 
            
                <div class="row g-3 mb-2 justify-items-start">
                    <label for="ambiente" class="col-lg-1 col-sm-2 col-form-label me-3">Ambiente</label>
                    <div class="col-auto">
                        <select v-model="itemModel.ambiente" class="form-select" :class="{'border-danger': !valido.ambiente}" aria-label="Ambiente">
                            <option v-for="ambiente in meus_ambientes" :value="ambiente.ambiente_codigo">
                                {{ ambiente.valor }}
                            </option>
                            </select>

                    </div>
                </div>

                <div class="row g-3 mb-2 justify-items-start">
                    <label for="descricao" class="col-lg-1 col-sm-2 col-form-label me-3">Descrição</label>
                    <div class="col-auto col-lg-8">
                        <input :class="{'border-danger': !valido.descricao}" placeholder="e.g., Reagentes, Vidraria, Placas de Circuito, Tecidos" type="text" class="form-control" id="descricao" v-model="itemModel.descricao">
                    </div>
                </div>

                <div class="row g-3 mb-2 justify-items-start">
                    <label for="medidas" class="col-lg-1 col-sm-2 col-form-label me-3 ">Medidas</label>
                    <div class="col-auto col-lg-8">
                        <input placeholder="L x A x P cm" type="text" class="form-control" id="medidas" v-model="itemModel.medidas">
                    </div>
                </div>

                <div class="row g-3 mb-2 justify-items-start">
                    <label for="peso" class="col-lg-1 col-sm-2 col-form-label me-3 ">Peso</label>
                    <div class="col-auto col-lg-8">
                        <input placeholder="xyz (g|kg)" type="text" class="form-control" id="peso" v-model="itemModel.peso">
                    </div>
                </div>
                <div class="row g-3 mb-2 justify-items-start">
                    <div class="col-auto col-lg-8">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="fragil" v-model="itemModel.fragil">
                            <label class="form-check-label" for="fragil">Frágil</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="especial"
                                v-model="itemModel.transporte_especial">
                            <label class="form-check-label" for="especial">Transporte especial</label>
                        </div>
                    </div>
                </div>

                <div class="row g-3 mb-2 justify-items-start">
                    <label for="observacoes" class="col-lg-1 col-sm-2 col-form-label me-3 ">Observações</label>
                    <div class="col-auto col-lg-8">
                        <input placeholder="Precisa de calibração ao instalar? Precisa de algum cuidado a mais no transporte?" type="text" class="form-control" id="observacoes" v-model="itemModel.observacoes">
                    </div>
                </div>

                <div class="row g-3 m-2 justify-items-end">
                    <div class="col col-lg-8"></div>
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
</template>