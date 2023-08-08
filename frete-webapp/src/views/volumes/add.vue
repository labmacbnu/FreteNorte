<script setup>
import { computed, inject, toValue, onMounted, onServerPrefetch, reactive, ref, watch, onBeforeMount } from 'vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesStore } from '@/stores/ambientes';
import {  registra_volume, apaga_volume } from '@/stores/volumes';
import { update_item_part, delete_part, get_parte_ref } from '@/stores/singleitem' 


import { db } from '@/backend/index.js';
import { collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
import {  useCollection, useDocument, usePendingPromises,  } from 'vuefire';  
import { useRoute, useRouter } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()

const route = useRoute()
const router = useRouter()

const categorias = useDocument(doc(db, "agregados", "categorias_volumes"))


const lista_ambientes_usuario = [...permissoes.ambientes, ...permissoes.usuario_de]

const ambientes = useCollection(query(collection(db, "ambientes"), where("ambiente_codigo", "in", lista_ambientes_usuario)))


const items = useItemsAmbienteStore()

const userRef = computed(() => doc(db, "usuarios", globaluser.value.email))
const volRef = collection(db, "volumes") 

const lista_items = ref( route.query.items  || [])
 
const ambiente_selected = ref( route.query.ambiente || null )

const new_volume = reactive(
  {
    categoria: null,
    responsavel: globaluser.value.email, 
    localizacao_atual: route.query.ambiente || null,
    origem: route.query.ambiente || null, 
    items: route.query.items || []
  }
)

const responsavel_label = computed(() => (globaluser.value.email) ? globaluser.value.displayName +  ' <'+globaluser.value.email+'>': "<?>")
const lider_ambiente_label = computed(() => {
  if(new_volume.origem ){
    const ambiente_obj = ambientes.value.find( x => x.ambiente_codigo == new_volume.origem)
    if(ambiente_obj) 
      return ambiente_obj.lider.nome + ' <' + ambiente_obj.lider.id + '>'
    else
      return "<?>"
  } else {
    return "<?>"
  }})




const all_items_ordered = computed(() => { 
  let all = [] 
  // filtrar apenas não volumados
  if(new_volume.origem)
    all.push(...items.dados) 
  return all.sort((a, b) => a.short_descricao.localeCompare(b.short_descricao))
})

const all_items_nao_volumados = computed(() =>
  all_items_ordered.value.filter((elem) => !elem.volumado))

function click_row(i) {
  document.getElementById("check" + i).click()
}

const filtrar_lista_items = ref("")

const all_items_filtered = computed(() => {
  if (filtrar_lista_items.value.length >= 3) {
    const regex = new RegExp(`.*${filtrar_lista_items.value}.*`, 'i');
    return all_items_nao_volumados.value.filter(
      obj => regex.test(obj.short_descricao)
    );
  }
  return all_items_nao_volumados.value
})
 

/**
 * WATCHERS
 */

watch( () => new_volume.origem, (newVal) => {
  lista_items.value = [ ],
  new_volume.localizacao_atual = newVal
  items.ambiente = newVal
  // new_volume.lider = ambientes[newVal].lider.id
} )

watch(lista_items, (newValue) => {
  new_volume.items = newValue
})

const validation = reactive({
    categoria: true,
    responsavel: true,  
    categoria: true,
    origem: true, 
    items: true
})
 
function validate(){
  validation.categoria = new_volume.categoria != null
  validation.responsavel = new_volume.responsavel != null 
  validation.categoria = new_volume.categoria != null
  validation.origem = new_volume.origem != null
  validation.items = new_volume.items.length != 0 
}
function reset_validation(){
  validation.categoria = true
  validation.responsavel = true
  validation.categoria = true
  validation.origem = true
  validation.items = true

}

async function salvar_volume() { 

  console.log(JSON.stringify(new_volume))
  validate()  
  for(const [key, value] of Object.entries(validation)){
    // se alguma coisa não for válida, retorna zero
    if(value == false){
      setTimeout(reset_validation, 1500)
      return 0
    }
  } 
  const volumeid = await registra_volume(toValue(new_volume)) 
  console.log(volumeid)
  setTimeout(() =>  router.push({name: 'volumes'}), 125)
}


async function load_all_data() {
  const permissoes = useUserPermissionsStore()
  const lista_ambientes_usuario = [...permissoes.ambientes, ...permissoes.usuario_de] 
  items.load_data(lista_ambientes_usuario) 
}

onMounted(async () => await load_all_data()) 
onServerPrefetch( () => usePendingPromises() )  
</script>

<template>
  <div class="row">
    <div class="col d-flex justify-content-end">
      <h1 class="flex-fill">Criar Volume</h1>
      <button class="btn btn-success" @click="salvar_volume">Salvar</button>
    </div> 
  </div>
  <form class="row g-3"> 
    <div class="col-6">
      <label for="ambiente" class="form-label">Ambiente</label>  
      <select :class="{'border-danger': !validation.origem}" v-model="new_volume.origem" class="form-select" id="ambiente">
        <option  v-for="(val, index ) in ambientes" :value="val.ambiente_codigo">
          <template v-if="val && val.ambiente_nome">
          {{ val.ambiente_codigo }} - {{ val.ambiente_nome }}
          </template>
        </option>
      </select>  
    </div>
    <div class="col-6">
      <label for="lider-ambiente" class="form-label">Líder do ambiente</label>    
      <input :class="{'border-danger': !validation.origem}" type="text" class="form-control" id="lider-ambiente"
       :value="lider_ambiente_label" disabled>
    </div>
    <div class="col-6">
      <label for="responsavel" class="form-label">Responsável por criar o volume</label>
      <input type="text" class="form-control" id="responsavel" 
      :value="responsavel_label" disabled>
    </div>
    <div class="col-6"> 
        <label for="floatingSelect" class="form-label">Categoria</label> 
        <select :class="{'border-danger': !validation.categoria}" v-model="new_volume.categoria" class="form-select" id="floatingSelect" aria-label="Floating label select example">
          <option v-if="categorias" v-for="x in categorias.valores">{{ x }}</option>
        </select>
    </div>
    
    <div class="col-12">
      <h3 :class="{'text-danger': !validation.items}">Items inclusos no volume</h3>
      <p class="form-text" v-if="new_volume.origem && ambientes[new_volume.origem]">
        Lista de items de {{ ambientes[new_volume.origem].ambiente_nome }}.</p>
      <p v-else>Selecione o ambiente acima.</p>
      <input type="text" class="form-control"
       placeholder="Digite para filtrar a lista abaixo" v-model="filtrar_lista_items">

    </div> 
    <div class="col-12 listatodositems overflow-y-scroll">
      <table v-if="new_volume.origem" class="table table-hover">
        <thead>
          <tr class="sticky-top">
            <th></th>
            <th>Descrição</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-bottom border-secondary " @click.stop="() => click_row(i)" v-for="(item, i) in all_items_filtered">
            <td>
              <input  @click.self="() => click_row(i)" class="form-check-input mx-1 border border-primary" type="checkbox" :value="item.key"
                v-model="lista_items" :id="'check' + i">
            </td>
            <td>
              {{ item.short_descricao }}
            </td>
            <td class="d-flex-inline">
              <p class="text-elipse p-lista-nao-volumados m-0">
                {{ item.key }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </form>
</template>
<style>

.listatodositems {
  height: 30vh;
}

</style>