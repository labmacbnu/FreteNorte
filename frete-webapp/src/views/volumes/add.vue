<script setup>
import { computed, inject, toValue, onMounted, onServerPrefetch, reactive, ref, watch, onBeforeMount } from 'vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesUserStore, useListaAmbientesNorteStore } from '@/stores/ambientes';
import { registra_volume, simbolos_nbr, servicos } from '@/stores/volumes';
import SelectPlus from '@/components/SelectPlus.vue';
import MedidasInput from '@/components/MedidasInput.vue';


import { db, get_query } from '@/backend/index.js';
import { collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
import { useCollection, useDocument, usePendingPromises } from 'vuefire';
import { useRoute, useRouter } from 'vue-router';
import PesoInput from '@/components/PesoInput.vue';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()
const { set_mensagem_popup } = inject("mensagem")

const route = useRoute()
const router = useRouter()

const categorias = useDocument(doc(db, "agregados", "categorias_volumes"))


const ambientes = useAmbientesUserStore()

const lista_ambientes_norte = useListaAmbientesNorteStore()

const pacotes = useCollection(query(collection(db, "pacotes")))

const caixas = computed(() => pacotes.value.filter(x => x.tipo == 'caixa'))

const items = useItemsAmbienteStore()


const lista_items = ref(route.query.items || [])

const lista_items_show = computed(() => {
  if(items.dados.length == 0) return []
  const selecionados = lista_items.value.map(x => items.dados.find(y => y.key == x))
  const agrupados = orderedGroupBy(selecionados, x => x.short_descricao)
  Object.entries(agrupados).forEach(([key, value]) => {
    agrupados[key] = {quantidade: value.length, tamanho: value[0].detalhes.medidas, peso: value[0].detalhes.peso}
  })
  return agrupados
})

const ambiente_selected = computed(() => ambientes.dados.find(x => x.codigo == new_volume.origem))

const new_volume = reactive(
  {
    categoria: null,
    responsavel: globaluser.value.email,
    localizacao_atual: route.query.ambiente || null,
    origem: route.query.ambiente || null,
    items: route.query.items || [],
    destino: '',
    observacao: '',
    propriedades: [],
    peso: null,
    medidas: null,
    embalagem: {
      caixa: null,
      platico_bolha: null,
      enchimento: null
    },
    servicos: [],
    status: ["Criado"]
  }
)

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}


 const ambientes_norte = ref([])

 watch(() => ambientes.ambientes, async () => {
  if (ambientes.ambientes) {
    const chunks = sliceIntoChunks(ambientes.ambientes, 30)
    const queries = chunks.map(chunck => query(collection(db, "ambientes-norte"), where("origem", "array-contains-any", chunck)))
    const resultado = [] 
    queries.forEach(async q => {
      const res = await get_query(q)
      resultado.push(...res)
    }); 
       
    ambientes_norte.value = resultado
  }
}, { immediate: true })



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
  new_volume.peso = null
  new_volume.medidas = {l: null, c: null, a: null}
  new_volume.embalagem = {caixa: null, platico_bolha: null, enchimento: null }
  new_volume.servicos = []
  new_volume.status = ["Criado"]
}



const responsavel_label = computed(() => (globaluser.value.email) ? globaluser.value.displayName + ' <' + globaluser.value.email + '>' : "<?>")
const lider_ambiente_label = computed(() => {
  if (new_volume.origem) {
    const ambiente_obj = ambientes.dados.find(x => x.codigo == new_volume.origem)
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
  // orderna primeiro pela descrição
  all.sort((a, b) => a.short_descricao.localeCompare(b.short_descricao))
  return all
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

watch(() => new_volume.embalagem.caixa, (newValue) => {
  if (newValue) {
    const caixa = caixas.value.find(x => x.id == newValue)
    if (caixa.medidas) {
      new_volume.medidas = caixa.medidas
    }
  }
})



watch(lista_items, (newValue) => {
  new_volume.items = newValue
})


function valida_inteiros(key_event) {
  const digito_regex = /\d/g 
  // Se precionar backspace, delete, tab, enter, arrow left ou arrow right, permite
  const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter']
  if (allowed.includes(key_event.key)) {
    return
  }
  // Se precionar qualquer outra coisa que não seja um dígito, não permite
  if ( !digito_regex.test(key_event.key) ) {
    key_event.preventDefault()
  }
}

const validation = reactive({
  categoria: true,
  responsavel: true,
  categoria: true,
  origem: true,
  items: true,
  destino: true,
  medidas: true,
  pre_medidas: false,
  peso: true
})


function validate() {
  validation.categoria = new_volume.categoria != null
  validation.responsavel = new_volume.responsavel != null
  validation.categoria = new_volume.categoria != null
  validation.origem = new_volume.origem != null
  validation.items = new_volume.items.length != 0
  validation.destino = new_volume.destino != ''
  validation.peso = typeof new_volume.peso == 'number' && new_volume.peso > 0
  validation.medidas = validation.pre_medidas
}

function reset_validation() {
  validation.categoria = true
  validation.responsavel = true
  validation.categoria = true
  validation.origem = true
  validation.items = true
  validation.destino = true
  validation.peso = true
  validation.medidas = true
}

async function salvar_volume() {
  console.log(JSON.stringify(new_volume))
  validate()
  for (const [key, value] of Object.entries(validation)) {
    // se alguma coisa não for válida, retorna zero
    if (value == false) {
      setTimeout(reset_validation, 1500)
    set_mensagem_popup("Preencha todos os campos em vermelho", "danger")
      return 0
    }
  }
  const volumeid = await registra_volume(toValue(new_volume))
  console.log(volumeid)
  set_mensagem_popup("Volume registrado com sucesso!", "success")
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
    <div class="col-12">

      <label for="responsavel" class="form-label fw-bold fs-5">Responsável por criar o volume</label>
      <input type="text" class="form-control" id="responsavel" :value="responsavel_label" disabled>
    </div>
    <div class="col-6">
      <label for="ambiente" class="form-label fw-bold fs-5">Ambiente de origem</label>
      <select :class="{ 'border-danger': !validation.origem }" v-model="new_volume.origem" class="form-select"
        id="ambiente">
        <option v-for="(val, index) in ambientes.dados" :value="val.codigo">
          <template v-if="val && val.nome">
            {{ val.codigo }} - {{ val.nome }}
          </template>
        </option>
      </select>
      <p class="form-text"><b>Líder do ambiente:</b> {{ lider_ambiente_label }}</p>
    </div>

    <div class="col-6">
      <label for="destino" class="form-label fw-bold fs-5">Ambiente destino</label>
      <SelectPlus :classe="(!validation.destino) ? 'border-danger' : ''" :valor="new_volume.destino"
        placeholder="Selecione um destino" @selected="(x) => new_volume.destino = x"
        :options="lista_ambientes_norte.dados"></SelectPlus>
      <p class="mt-2 mb-1 fw-bold d-flex justify-content-between fs-5">Destinos sugeridos
        <i data-bs-toggle="tooltip" data-bs-title="Com base na alocação final dos ambientes"
          class="bi bi-question-circle"></i>
      </p>
      <p>
        <a @click="() => new_volume.destino = x.codigo" :title="x.nome" class="btn btn-light"
          v-for="x in destino_filtrado">{{ x.codigo }}</a>
      </p>
    </div>

    <div class="col-12">
      <div class="accordion" id="accordionItemsWrap">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button :class="{ 'text-danger': !validation.items }" class="accordion-button fw-bold collapsed fs-5" type="button"
              data-bs-toggle="collapse" data-bs-target="#collapseItems" aria-expanded="false"
              aria-controls="collapseItems">
              <span :class="[lista_items.length == 0 ? 'bg-secondary' : 'bg-primary', { 'bg-danger': !validation.items }]"
                class="badge me-2">{{ lista_items.length }}</span>
              Items inclusos no volume
            </button>
          </h2>
          <div id="collapseItems" class="accordion-collapse collapse" data-bs-parent="#accordionItemsWrap">
            <div class="accordion-body">
              <p class="form-text" v-if="ambiente_selected">
                Lista de items de {{ ambiente_selected.nome }}.</p>
              <p v-else>Selecione o ambiente acima.</p>
              <input type="text" class="form-control" placeholder="Digite para filtrar a lista abaixo"
                v-model="filtrar_lista_items">
              <div class="col-12 listatodositems overflow-y-scroll">
                <table v-if="new_volume.origem" class="table table-hover table-sm">
                  <thead>
                    <tr class="sticky-top">
                      <th></th>
                      <th>Descrição</th>
                      <th>Cód. Barras</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-bottom border-secondary " @click.stop="() => click_row(i)"
                      v-for="(item, i) in all_items_filtered" :key="item.key">
                      <td>
                        <input @click.self="() => click_row(i)" class="form-check-input mx-1 border border-primary"
                          type="checkbox" :value="'' + item.key" v-model="lista_items" :id="'check' + i">
                      </td>
                      <td class="text-lowercase">
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
            </div>
          </div>
        </div>
      </div>
      <table class="table mt-2">
        <caption>Utilize os dados dessa tabela para calcular as medidas do volume.</caption>
        <thead>
          <th>Quant.</th><th>Descrição</th><th>Medidas</th><th>Peso</th>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="(value, key) in lista_items_show">
            <td>{{ value.quantidade }}</td><td>{{ key }}</td><td>{{ value.tamanho }}</td><td>{{ value.peso }}</td>

          </tr>
        </tbody>
      </table> 
    </div>


    <div class="col-xs-12 col-md-6">
      <label for="categoriaSelect" class="form-label fw-bold fs-5">Categoria</label>
      <select :class="{ 'border-danger': !validation.categoria }" v-model="new_volume.categoria"
        class="form-select form-select-lg " id="categoriaSelect" aria-label="Floating label select example">
        <option v-if="categorias" v-for="x in categorias.valores.sort()">{{ x }}</option>
      </select>
    </div>


    <div class="col-xs-12  col-md-6">
      <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Embalagem
      </p> 
      <form>
        <div class="row mb-2">
          <label class="col-sm-3 col-form-label fw-medium" for="caixaSelect" >Caixa</label>
          <div class="col-sm-9">
            <select id="caixaSelect" v-model="new_volume.embalagem.caixa" class="form-select">
              <option v-for="caixa in caixas" :value="caixa.id">{{ caixa.label }}</option>
            </select>
          </div>
        </div>
        <div class="row  mb-2">
          <label class="col-sm-3  form-check-label fw-medium" for="plastico_bolha">Plástico Bolha</label>
          <div class="col-sm-9">
            <div class="input-group">
            <input placeholder="Quantos metros de plástico bolha são suficientes?" @keydown="valida_inteiros" class="form-control" id="platico_bolha" v-model.number="new_volume.embalagem.platico_bolha">
              <span class="input-group-text">m</span>
            </div>
          </div>
        </div>

        <div class="row  mb-2">
          <label class="col-sm-3  form-check-label fw-medium" for="enchimento">Enchimento</label>
          <div class="col-sm-9">
            <input class="form-check-input" type="checkbox" v-model="new_volume.embalagem.enchimento" id="enchimento"><label class="ms-3 form-check-label form-text"
              for="enchimento">(Papel ou Isopor para preencher a caixa)</label>
          </div>
        </div>

      </form>
    </div>
    <div class="col-xs-12  col-md-6">
      <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Medidas
      </p>
      <div class="border rounded" :class="{ 'border-danger': !validation.medidas }">
        <MedidasInput :medidas="new_volume.medidas" :inner_validate="true" @update="x => new_volume.medidas = x"
          @validate="x => validation.pre_medidas = x"></MedidasInput>
      </div>
      <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Peso
      </p>
      <div class="border rounded" :class="{ 'border-danger': !validation.peso }">
        <PesoInput :peso="new_volume.peso" @update="x => new_volume.peso = x"></PesoInput>
      </div>
    </div>

    <div class="col-xs-12 col-md-6 mb-4">
      <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Serviços
          </p>
      <div class="row">
        <div class="col-4 col-sm-6 text-start" v-for="(item, n) in servicos">
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" :value="item" :id="'servis' + n"
              v-model="new_volume.servicos">
            <label class="form-check-label" :for="'servis' + n">
              {{ item }}
            </label>
          </div>
        </div>
      </div>
    </div>
    

    <div class="col-xs-12 col-md-6 mb-4">
      <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Propriedades do volume
        <i data-bs-toggle="tooltip"
          data-bs-title="As propriedades abaixo representam símbolos que serão impressos nas etiquetas dos volumes"
          class="bi bi-question-circle"></i>
      </p>
      <div class="row">
        <div class="col-4 col-sm-6 text-start" v-for="(item, n) in simbolos_nbr_ordenados">
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" :value="item.key" :id="'props' + n"
              v-model="new_volume.propriedades">
            <label class="form-check-label" :for="'props' + n">
              {{ item.key }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-md-6">
      <label for="observacao" class="form-label fw-bold fs-5">Observação</label>
      <textarea class="form-control" id="observacao" rows="3" placeholder="Alguma obervação especial para esse volume?"
        v-model="new_volume.observacao"></textarea>
    </div>
  </form>
</template>
<style>
.listatodositems {
  height: 30vh;
}
</style>