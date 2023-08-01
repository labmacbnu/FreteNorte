<script setup>
import { computed, inject, onBeforeMount, onMounted, onServerPrefetch, ref } from 'vue';
import Modal from '../components/Modal.vue';
import ModalDelete from '../components/ModalDelete.vue';
import { useUserPermissionsStore } from '../stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '../stores/items';
import { useAmbientesStore } from '../stores/ambientes';
import { useNumVolumesStore, registra_volume, useVolumesEmailStore, apaga_volume } from '../stores/volumes';
import { update_item_part, delete_part, get_parte_ref } from '../stores/singleitem'
import Acordeao from '../components/AcordeaoVolumes.vue';
import QRCode from '../components/QRCode.vue';

import { db } from '../backend/index.js';
import { collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
import { useCollection } from 'vuefire';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()
const ambientes = useAmbientesStore()

const items = useItemsAmbienteStore()
 


const userRef = computed(() => doc(db, "usuarios", globaluser.value.email))
const volRef = collection(db, "volumes")
const q = computed(() =>  query(volRef, where("responsavel", "==", userRef.value), where('deleted', '==', false)))
const volumes = useCollection(q.value, {wait: true})



const lista_items = ref([])

async function load_all_data() {
  const permissoes = useUserPermissionsStore()
  for (let amb of [...permissoes.ambientes, ...permissoes.usuario_de]) {
    console.log(amb)
    items.ambiente = amb
    await items.load_data()
  } 
}



const all_items_ordered = computed(() => {
  if (!permissoes.ambientes) return []
  let all = []
  for (let amb of [...permissoes.ambientes, ...permissoes.usuario_de]) {
    if (items.inner_db[amb]) {
      // filtrar apenas não volumados
      all.push(...items.inner_db[amb])
    }
  }
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


const all_volumes_dict = computed(() => {
  const dicionario = {} // {'teste': [{short_descricao: 1, key: "a"}]}
  if (volumes) {
    volumes.value.forEach((doc) => {
      // VERIFICAR O QUE TÁ ACONTECENDO AQUI
      const lista_items = []
      doc.items.forEach((i) => lista_items.push(i))
      dicionario[doc.codigo] = lista_items
    })
  }
  return dicionario
})



async function salvar_volume() {
  const volume = {
    categoria: "NULL",
    responsavel: globaluser.value.email,
    items: lista_items.value
  }
  console.log(volume)
  const uptime = registra_volume(volume)
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

async function deleta_volume_parte(parte_key) {
  const parteRef = await get_parte_ref(parte_key)
  const [itemKey, _] = parte_key.split("-")
  // apaga do item
  await update_item_part(itemKey, 'remove', parteRef)
  // hard apaga a parte
  await delete_part(parte_key)
}

async function soft_apaga_volume(codigo) {
  const items_do_volume = all_volumes_dict.value[codigo]
  console.log(`Apagando volume ${codigo} com ${items_do_volume.length} items`)
  // vamos desavolumar aqui localmente
  items_do_volume.forEach(element => {
    if (element.key.includes("-")) {
      // SE TEM TRAÇO NA KEY
      console.log(`Apagando parte ${element.key}`)
      deleta_volume_parte(element.key)
    } else { // SE NÃO TEM TRAÇO NO KEY
      // se for um item normal
      console.log(`Desavolumento item ${element.key}`)
      var itemRef = all_items_ordered.value.find(x => x.key == element.key)
      Object.assign(itemRef, { volumado: false })
    }
  });
  const uptime = apaga_volume(codigo)
  return true
}

const soft_volume_modal_ref = ref(null)
const soft_volume_modal_items = computed(() => {
  if(soft_volume_modal_ref.value){
    return all_volumes_dict.value[soft_volume_modal_ref.value]
  }
})


onBeforeMount(() => volumes.email = permissoes.email)
onBeforeMount(async () => await load_all_data())
//onServerPrefetch(() => usePendingPromises())
</script>

<template>
  <div class="row mb-3 justify-content-end">
    <div class="col text-end">
      <button class="btn-primary btn d-print-none" data-bs-target="#criarVolume" data-bs-toggle="modal">Criar novo volume</button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <table class="table d-print-table align-middle">
        <thead>
          <tr>
            <th class="d-none d-print-table-cell">Volume</th>
            <th class="d-print-none">Código</th>
            <th>Lista de items</th>
            <th class="d-print-none"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="volume in volumes" :key="'volume' + volume.codigo">
          <td class="d-none d-print-table-cell text-center">
            <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode>
            <p>{{ volume.codigo }}</p>
          </td>
          <td class="d-print-none"> 
            <RouterLink class="" :to="{name: 'volume-codigo', params: {codigo: volume.codigo }}">
            {{ volume.codigo }}
          </RouterLink>
          </td>
          <td> 
            <ul class="list-group list-group-flush align-top">
              <li v-for="item in volume.items" :key="'I' + item.key" class="list-group-item justify-content-between d-flex">
                <small class="" v-if="item.key">{{ item.key.includes("-") ? item.descricao :  item.short_descricao }}</small>
                <span class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</span>
              </li> 
              </ul>
          </td>
          <td class="d-print-none">
            <button class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal" 
            @click="() => soft_volume_modal_ref = volume.codigo"><i class="bi bi-trash" title="Apagar volume"></i></button>
          </td>
        </tr>
      </tbody>
      </table>
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
          <input type="text" class="form-control text-secondary" id="codigo" value="[[...]]" disabled>
        </div>

        <div class="col-6">
          <label for="responsavel" class="form-label">Responsável</label>
          <input type="text" class="form-control" id="responsavel" :value="globaluser.email" disabled>
        </div>
        <div class="col-12">
          <div class="form-floating">
              <select class="form-select" 
              id="floatingSelect" aria-label="Floating label select example">
                <option v-for="x in ['A', 'B', 'C']">{{ x }}</option>    
              </select>
              <label for="floatingSelect">Categoria</label>
            </div>
          </div>
        <div class="col-12">
          <h3>Lista de items inclusos no lote</h3>
        </div>
        <div class="col-12">
          <input type="text" class="form-control" placeholder="Digite para filtrar a lista" v-model="filtrar_lista_items">
        </div>
        <div class="col-12 listatodositems overflow-y-scroll">
          <table class="table">
            <thead>
              <tr class="sticky-top">
                <th></th>
                <th>Descrição</th>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
              <tr @click.stop="() => click_row(i)" v-for="(item, i) in all_items_filtered">
                <td>
                  <input @click.self="() => click_row(i)" class="form-check-input mx-1" type="checkbox" :value="item.key"
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
  </Modal>
 
<ModalDelete modalid="apagare" :delete_callback="() => soft_apaga_volume(soft_volume_modal_ref)">
<template #titulo>
  Apagar volume
</template>
<template #corpo>
  Certeza que quer apagar o volume {{soft_volume_modal_ref}}?
  <ul class="listinhadelete list-group overflow-y-scroll">
    <li v-for="item in soft_volume_modal_items" :key="'DD' + item.key" class="list-group-item justify-content-between d-flex">
      <span>{{ item.key.includes("-") ? item.descricao :  item.short_descricao }}</span>
      <span class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</span>
    </li> 
  </ul>
</template>

</ModalDelete> 
 
</template>
<style>
.listatodositems {
  height: 30vh;
}

.listinhadelete {
  max-height: 20vh;
}
.text-elipse {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.p-lista-nao-volumados {
  width: 5em;
}

.span-lista-volumes {
  width: 6em;
}
</style>
 