<script setup>
import { computed, inject, onBeforeMount, onMounted, onServerPrefetch, ref } from 'vue';
import Modal  from '../components/Modal.vue';
import { useUserPermissionsStore } from '../stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '../stores/items';
import { useAmbientesStore } from '../stores/ambientes'; 
import { useNumVolumesStore, registra_volume, lista_volumes } from '../stores/volumes';
import { volumesRef } from '../backend/index';  
import { usePendingPromises } from 'vuefire'
import Acordeao from '../components/AcordeaoVolumes.vue';

const {globaluser, updateUser} = inject("globaluser")
const permissoes = useUserPermissionsStore()
const ambientes = useAmbientesStore()

const items = useItemsAmbienteStore()
 
const n_volumes = useNumVolumesStore()

const volumes = lista_volumes(globaluser.value.email) 
          


const lista_items = ref([])

async function load_all_data(){
  const permissoes = useUserPermissionsStore()
  for(let amb of permissoes.ambientes){
    const ambiente = ambientes.dados.filter( (elem) => elem.ambiente_codigo == amb )[0]
    items.ambiente = ambiente.valor
    await items.load_data()
  }
}

const all_items_ordered = computed(() => {
  if( !permissoes.ambientes ) return []
  let all = [] 
  for(let amb of permissoes.ambientes){
    const ambiente = ambientes.dados.filter( (elem) => elem.ambiente_codigo == amb )[0] 
    if(items.inner_db[ambiente.valor]){
      all.push(...items.inner_db[ambiente.valor])
    }
  }
  return all.sort( (a,b) => a.short_descricao.localeCompare(b.short_descricao))
})

function click_row(i){
  document.getElementById("check" + i).click()
}

const filtrar_lista_items = ref("")

const all_items_filtered = computed(()=> {
  if(filtrar_lista_items.value.length >= 3) {
    const regex = new RegExp(`.*${filtrar_lista_items.value}.*`, 'i'); 
    return all_items_ordered.value.filter(
        obj => regex.test(obj.short_descricao)
        );
  }
  return all_items_ordered.value
})
 

const all_volumes_dict = computed(() => {
    const dicionario = { } // {'teste': [{short_descricao: 1, key: "a"}]}
    volumes.value.forEach((doc) => {
        const lista_items = []
        doc.items.forEach((i) => lista_items.push(i))
        dicionario[doc.codigo] = lista_items
    })
    return dicionario
})
 


async function salvar_volume(){ 
  const volume = {
    codigo: codigo.value,
    responsavel: globaluser.value.email,
    items: lista_items.value
  }
  console.log(volume) 
  const uptime = registra_volume(volume) 
  if(uptime){ 
    lista_items.value = []
    return true
  } else {
    return false
  }
}




onMounted(async () => await load_all_data())  
onServerPrefetch(() => usePendingPromises())
</script>

<template>
    <div class="row mb-3 justify-content-end">
        <div class="col text-end">
            <button class="btn-primary btn" data-bs-target="#criarVolume" data-bs-toggle="modal">Criar novo volume</button>
        </div> 
    </div>
  <div class="row"> 
    <div class="col">    
    <Acordeao id="volumes" :lista_agrupada="all_volumes_dict"></Acordeao> 
    </div>
  </div>
  <Modal modalid="criarVolume" :salve_callback="async () => await salvar_volume()">
  <template #titulo>
    Criar novo volume
  </template>
  <template #corpo>
   <form class="row g-3">
    <div class="col-6">
      <label for="codigo" class="form-label">Código</label>
      <input type="text" class="form-control" id="codigo" :value="n_volumes.codigo" disabled> 
    </div>

    <div class="col-6">
      <label for="responsavel" class="form-label">Responsável</label>    
        <input type="text" class="form-control" id="responsavel" :value="globaluser.email" disabled>   
    </div> 
    <div class="col-12">
      <h3>Lista de items inclusos no lote</h3>
    </div>
    <div class="col-12">
      <input type="text" class="form-control" placeholder="Digite para filtrar a lista" v-model="filtrar_lista_items">
      </div>
    <div class="col-12 listatodositems overflow-y-scroll">
      
     <table class="table ">
      <thead>
        <tr class="sticky-top"><th></th><th>Descrição</th><th>Código</th></tr>
      </thead>
      <tbody>
      <tr @click.stop="() => click_row(i)" v-for="(item,i) in all_items_filtered">
        <td>
          <input @click.self="() => click_row(i)" class="form-check-input mx-1" type="checkbox"
 :value="item.key" v-model="lista_items" :id="'check' + i">
        </td>
        <td>
          {{ item.short_descricao }} 
        </td>
        <td>
          {{ item.key }}
        </td>
      </tr></tbody>
     </table>
    </div>
   </form>
  </template>
  </Modal>  
</template>
<style>
.listatodositems{
  height: 30vh;
}

</style>
 