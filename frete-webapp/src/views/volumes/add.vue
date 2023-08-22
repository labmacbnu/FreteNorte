<script setup>
import { computed, inject, toValue, onMounted, onServerPrefetch, reactive, ref, watch, onBeforeMount } from 'vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesUserStore, useListaAmbientesNorteStore } from '@/stores/ambientes';
import { registra_volume, simbolos_nbr } from '@/stores/volumes';
import SelectPlus from '@/components/SelectPlus.vue';


import { db } from '@/backend/index.js';
import { collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
import { useCollection, useDocument, usePendingPromises } from 'vuefire';
import { useRoute, useRouter } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()

const route = useRoute()
const router = useRouter()

const categorias = useDocument(doc(db, "agregados", "categorias_volumes"))


const ambientes = useAmbientesUserStore()

const lista_ambientes_norte = useListaAmbientesNorteStore()


const items = useItemsAmbienteStore()


const lista_items = ref(route.query.items || [])

const ambiente_selected = computed(() => ambientes.dados.find(x => x.ambiente_codigo == new_volume.origem))

const new_volume = reactive(
  {
    categoria: null,
    responsavel: globaluser.value.email,
    localizacao_atual: route.query.ambiente || null,
    origem: route.query.ambiente || null,
    items: route.query.items || [],
    destino: '',
    observacao: '',
    propriedades: []
  }
)


const { data: ambientes_norte } = useCollection(query(collection(db, "ambientes-norte"), where("origem", "array-contains-any", ambientes.ambientes)))


const destino_filtrado = computed(() => {
  if (new_volume.origem && ambientes_norte.value) {
    return ambientes_norte.value.filter(x => x.origem.includes(new_volume.origem))
  } else {
    return []
  }
})

function reset_new_volume() {
  new_volume.categoria = null
  new_volume.responsavel = globaluser.value.email
  new_volume.localizacao_atual = route.query.ambiente || new_volume.localizacao_atual
  new_volume.origem = route.query.ambiente || new_volume.origem
  new_volume.destino = ''
  new_volume.observacao = null
  new_volume.propriedades = []
  //new_volume.items = []
}



const responsavel_label = computed(() => (globaluser.value.email) ? globaluser.value.displayName + ' <' + globaluser.value.email + '>' : "<?>")
const lider_ambiente_label = computed(() => {
  if (new_volume.origem) {
    const ambiente_obj = ambientes.dados.find(x => x.ambiente_codigo == new_volume.origem)
    if (ambiente_obj && ambiente_obj.lider)
      return ambiente_obj.lider.nome + ' <' + ambiente_obj.lider.id + '>'
    else
      return "Ambiente não possui líder"
  } else {
    return "<?>"
  }
})




const all_items_ordered = computed(() => {
  const all = []
  if (new_volume.origem && items.dados)
    all.push(...items.dados)
  return all.sort((a, b) => a.short_descricao.localeCompare(b.short_descricao))
})

const all_items_nao_volumados = computed(() => {
  if (all_items_ordered.value.length > 0) {
    return all_items_ordered.value.filter((elem) => !elem.meta.volumado && elem.meta.inteiro)
  } else {
    return []
  }
})

function click_row(i) {
  document.getElementById("check" + i).click()
}

const simbolos_nbr_ordenados = computed(() => {
  const all = []
  for (const [key, value] of Object.entries(simbolos_nbr)) {
    all.push({ key, value })
  }
  return all.sort((a, b) => a.value.localeCompare(b.value))
})

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

watch(() => new_volume.origem, (newVal) => {
  lista_items.value = [],
    new_volume.localizacao_atual = newVal
  items.ambiente = newVal
  // new_volume.lider = ambientes[newVal].lider.id
})

watch(lista_items, (newValue) => {
  new_volume.items = newValue
})

const validation = reactive({
  categoria: true,
  responsavel: true,
  categoria: true,
  origem: true,
  items: true,
  destino: true,
})

function validate() {
  validation.categoria = new_volume.categoria != null
  validation.responsavel = new_volume.responsavel != null
  validation.categoria = new_volume.categoria != null
  validation.origem = new_volume.origem != null
  validation.items = new_volume.items.length != 0
  validation.destino = new_volume.destino != ''
}
function reset_validation() {
  validation.categoria = true
  validation.responsavel = true
  validation.categoria = true
  validation.origem = true
  validation.items = true
  validation.destino = true

}

async function salvar_volume() {

  console.log(JSON.stringify(new_volume))
  validate()
  for (const [key, value] of Object.entries(validation)) {
    // se alguma coisa não for válida, retorna zero
    if (value == false) {
      setTimeout(reset_validation, 1500)
      return 0
    }
  }
  const volumeid = await registra_volume(toValue(new_volume))
  console.log(volumeid)
  reset_new_volume()
}

onMounted(() => {
  items.ambiente = new_volume.origem
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

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
      <label for="ambiente" class="form-label">Ambiente de origem</label>
      <select :class="{ 'border-danger': !validation.origem }" v-model="new_volume.origem" class="form-select"
        id="ambiente">
        <option v-for="(val, index ) in ambientes.dados" :value="val.ambiente_codigo">
          <template v-if="val && val.ambiente_nome">
            {{ val.ambiente_codigo }} - {{ val.ambiente_nome }}
          </template>
        </option>
      </select>
    </div>
    <div class="col-6">
      <label for="lider-ambiente" class="form-label">Líder do ambiente</label>
      <input :class="{ 'border-danger': !validation.origem }" type="text" class="form-control" id="lider-ambiente"
        :value="lider_ambiente_label" disabled>
    </div>

    <div class="col-6">
      <label for="destino" class="form-label">Ambiente destino</label>
      <SelectPlus :classe="(!validation.categoria) ? 'border-danger' : ''" :valor="new_volume.destino"
        placeholder="Selecione um destino" @selected="(x) => new_volume.destino = x"
        :options="lista_ambientes_norte.dados"></SelectPlus>
    </div>
    <div class="col-6">
      <p class="mb-2">Destinos sugeridos</p>
      <p>
        <a @click="() => new_volume.destino = x.codigo" :title="x.nome" class="btn btn-light"
          v-for="x in destino_filtrado">{{ x.codigo }}</a>
      </p>
    </div>

    <div class="col-6">
      <label for="floatingSelect" class="form-label">Categoria</label>
      <select :class="{ 'border-danger': !validation.categoria }" v-model="new_volume.categoria" class="form-select"
        id="floatingSelect" aria-label="Floating label select example">
        <option v-if="categorias" v-for="x in categorias.valores">{{ x }}</option>
      </select>
    </div>

    <div class="col-6">
      <label for="responsavel" class="form-label">Responsável por criar o volume</label>
      <input type="text" class="form-control" id="responsavel" :value="responsavel_label" disabled>
    </div>
    <div class="col-6">
      <label for="observacao" class="form-label">Observação</label>
      <textarea class="form-control" id="observacao" rows="2" placeholder="Alguma obervação especial para esse volume?"
        v-model="new_volume.observacao"></textarea>
    </div>

    <div class="col-6">
      <p class="mb-1 fw-bold d-flex justify-content-between">Propriedades do volume  
        <i data-bs-toggle="tooltip" data-bs-title="As propriedades abaixo representam símbolos que serão impressos nas etiquetas dos volumes" class="bi bi-question-circle"></i> </p> 
      <div class="row">
      <div class="col-6 text-start" v-for="(item, n) in simbolos_nbr_ordenados">
        <div class="form-check mb-1">
          <input  class="form-check-input" type="checkbox" :value="item.key" :id="'props' + n" v-model="new_volume.propriedades">
          <label class="form-check-label" :for="'props' + n">
            {{item.key}}
          </label>
        </div>
      </div>
    </div>
    </div>

    <div class="col-12">
      <h3 :class="{ 'text-danger': !validation.items }">Items inclusos no volume</h3>
      <p class="form-text" v-if="ambiente_selected">
        Lista de items de {{ ambiente_selected.ambiente_nome }}.</p>
      <p v-else>Selecione o ambiente acima.</p>
      <input type="text" class="form-control" placeholder="Digite para filtrar a lista abaixo"
        v-model="filtrar_lista_items">

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
          <tr class="border-bottom border-secondary " @click.stop="() => click_row(i)"
            v-for="(item, i) in all_items_filtered" :key="item.key">
            <td>
              <input @click.self="() => click_row(i)" class="form-check-input mx-1 border border-primary" type="checkbox"
                :value="'' + item.key" v-model="lista_items" :id="'check' + i">
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
}</style>