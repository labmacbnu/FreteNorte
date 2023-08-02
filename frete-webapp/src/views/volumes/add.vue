<script setup>
import { computed, inject, onBeforeMount, onMounted, onServerPrefetch, reactive, ref, watch } from 'vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesStore } from '@/stores/ambientes';
import {  registra_volume, apaga_volume } from '@/stores/volumes';
import { update_item_part, delete_part, get_parte_ref } from '@/stores/singleitem' 

import { db } from '@/backend/index.js';
import { collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
import {  useDocument, usePendingPromises,  } from 'vuefire';  

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()

const categorias = useDocument(doc(db, "agregados", "categorias_volumes"))
const ambientes = reactive({})

const lista_ambientes = [...permissoes.ambientes, ...permissoes.usuario_de];

lista_ambientes.forEach( (amb) => {
  ambientes[amb] = useDocument(doc(db, "ambientes", amb))
})

const items = useItemsAmbienteStore()

const userRef = computed(() => doc(db, "usuarios", globaluser.value.email))
const volRef = collection(db, "volumes") 

const lista_items = ref([])
const ambiente_selected = ref(null)
const new_volume = reactive(
  {
    categoria: null,
    responsavel: globaluser.value.email,
    lider: null,
    localizacao_atual: null,
    origem: null, 
    items: null
  }
)
async function load_all_data() {
  const permissoes = useUserPermissionsStore()
  for (let amb of [...permissoes.ambientes, ...permissoes.usuario_de]) {
    console.log(amb)
    items.ambiente = amb
    await items.load_data()
  } 
}



const all_items_ordered = computed(() => { 
  let all = [] 
  // filtrar apenas não volumados
  if(new_volume.origem)
    all.push(...items.inner_db[new_volume.origem]) 
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
  // new_volume.lider = ambientes[newVal].lider.id
} )

watch(lista_items, (newValue) => {
  new_volume.items = newValue
})


async function salvar_volume() { 

  console.log(JSON.stringify(new_volume))
  return 0
  //const uptime = registra_volume(volume)
  if (uptime) {
    for (let item of lista_items.value) {
      var itemRef = all_items_ordered.value.find(x => x.key == item)
      itemRef.volumado = true
    }
    lista_items.value = []

    return true
  } else {
    return false
  }
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
      <label for="responsavel" class="form-label">Responsável por criar o volume</label>
      <input type="text" class="form-control" id="responsavel" :value="globaluser.email" disabled>
    </div>
    <div class="col-6"> 
        <label for="floatingSelect" class="form-label">Categoria</label> 
        <select v-model="new_volume.categoria" class="form-select" id="floatingSelect" aria-label="Floating label select example">
          <option v-for="x in categorias.valores">{{ x }}</option>
        </select>
    </div>
    <div class="col-6">
      <label for="ambiente" class="form-label">Ambiente</label>  
      <select v-model="new_volume.origem" class="form-select" id="ambiente">
        <option  v-for="(val, key, index ) in ambientes" :value="key">
          <template v-if="val.ambiente_nome">
          {{ val.ambiente_codigo }} - {{ val.ambiente_nome }}
          </template>
        </option>
      </select>  
    </div>
    <div class="col-6">
      <label for="lider-ambiente" class="form-label">Líder do ambiente</label>    
      <input type="text" class="form-control" id="lider-ambiente" :value="globaluser.email" disabled>
    </div>
    <div class="col-12">
      <h3>Lista de items inclusos no lote</h3>
      <p class="form-text" v-if="new_volume.origem">
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