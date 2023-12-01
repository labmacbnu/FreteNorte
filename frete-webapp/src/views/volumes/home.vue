<script setup>
import { inject, ref } from 'vue';
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore } from '@/stores/items';
import { registra_volume, apaga_volume, useVolumesEmailStore } from '@/stores/volumes';
import VolumesTable from '@/components/VolumesTable.vue';
import { RouterLink, useRouter } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()

const items = useItemsAmbienteStore()

const volumes = useVolumesEmailStore()

function click_row(i) {
  document.getElementById("check" + i).click()
}




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


async function soft_apaga_volume(codigo) {
  console.log(`Apagando volume ${codigo}`)
  const volume_registry = volumes.dados.find(x => x.codigo == codigo)
  const items_do_volume = volume_registry.items
  const uptime = apaga_volume(codigo)
  return true
}

const soft_volume_modal_ref = ref(null)
const codigo_search = ref(null)
const router = useRouter()

function checkprivileges() {
  if (!globaluser) {
    return false
  } 
  if (globaluser.role == "Comissão de Logística" || globaluser.role == "Administrador") {
    return true
  } else {
    return false
  }

}
</script>

<template>
  <div class="row g-2 mb-3" v-if="checkprivileges">
    <div class="col-6 border rounded p-2">
      <h3>Pesquisa volume por código</h3>
      <p>Digite o código e pesquise pelo volume. </p>
      <div class="input-group mb-3">

        <input class="form-control" v-model="codigo_search" type="text">
        <button class="btn btn-outline-primary" type="button" id="button-addon1"
          @click="router.push({ name: 'volume-codigo', params: { codigo: codigo_search } })"><i class="bi-search bi"></i> Pesquisar volume</button>
      </div>
    </div>

  </div>
  <div class="row mb-3 align-items-end">
    <div class="col-6">
      <h1>Volumes que você criou</h1>
    </div>
    <div class="col">
      <RouterLink :to="{ name: 'volumes-print' }" class="text-secondary icon-link"><i class="bi-printer" bi></i> Versão para
        impressão</RouterLink>
    </div>
    <div class="col text-end">
      <RouterLink class="btn btn-success btn-lg" :to="{ name: 'volume-add' }">Criar Volume</RouterLink>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <VolumesTable :volumes="volumes.dados" @delete_callback="(codigo) => soft_volume_modal_ref = codigo">
      </VolumesTable>
    </div>
  </div>


  <ModalDelete modalid="apagare" :delete_callback="() => soft_apaga_volume(soft_volume_modal_ref)">
    <template #titulo>
      Apagar volume
    </template>
    <template #corpo>
      Certeza que quer apagar o volume {{ soft_volume_modal_ref }}?
    </template>

  </ModalDelete>
</template>
<style>
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
</style>
 