<script>
import { computed, inject, onBeforeMount, onMounted, onServerPrefetch, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesStore } from '@/stores/ambientes';
import { useNumVolumesStore, registra_volume, useVolumesEmailStore, apaga_volume } from '@/stores/volumes';
import { update_item_part, delete_part, get_parte_ref } from '@/stores/singleitem'
import Acordeao from '@/components/AcordeaoVolumes.vue';
import QRCode from '@/components/QRCode.vue';

import { db } from '@/backend/index.js';
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
        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
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