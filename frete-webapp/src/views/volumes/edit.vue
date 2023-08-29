<script setup>
import { computed, inject, toValue, onMounted,  reactive, ref, watch } from 'vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesUserStore, useListaAmbientesStore, useListaAmbientesNorteStore } from '@/stores/ambientes';
import { registra_volume, simbolos_nbr } from '@/stores/volumes';
import SelectPlus from '@/components/SelectPlus.vue';
import MedidasInput from '@/components/MedidasInput.vue';


import { db } from '@/backend/index.js';
import { collection, where, doc, query, updateDoc } from 'firebase/firestore';
import { useCollection, useDocument, } from 'vuefire';
import { useRoute, useRouter } from 'vue-router';
import PesoInput from '@/components/PesoInput.vue';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()
const { set_mensagem_popup } = inject("mensagem")

const route = useRoute()
const router = useRouter()

const documento = computed(()=> doc(db, "volumes", route.params.codigo))

const { data: volume_editado, pending, promise: editado_promisse } = useDocument(documento, { maxRefDepth: 1 })

const categorias = useDocument(doc(db, "agregados", "categorias_volumes"))

const ambientes = useAmbientesUserStore()

const lista_ambientes_norte = useListaAmbientesNorteStore()
const lista_ambientes_sul = useListaAmbientesStore()

const localizacao_atual = reactive({
  campus: null,
  codigo: null
})

watch(()=> localizacao_atual.campus, (newVal) => {
  localizacao_atual.codigo = ''
  if (volume_editado.value.localizacao_atual.campus == newVal) {
    localizacao_atual.codigo = volume_editado.value.localizacao_atual.codigo
  }
})

editado_promisse.value.then( () => {
  localizacao_atual.campus = volume_editado.value.localizacao_atual.campus
  localizacao_atual.codigo = volume_editado.value.localizacao_atual.codigo
})

const lista_opcoes_ambientes = computed( () => {
  return localizacao_atual.campus == "Sul" ? lista_ambientes_sul.dados : lista_ambientes_norte.dados
})
 


const pacotes = useCollection(query(collection(db, "pacotes")))
const caixas = computed(() => pacotes.value.filter(x => x.tipo == 'caixa'))

const items = useItemsAmbienteStore()
const lista_items = ref(route.query.items || [])


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
    }
  }
)

const validation = reactive({
  //categoria: true,
  //responsavel: true,
  //categoria: true,
  //origem: true,
  //items: true,
  //destino: true,
  medidas: true,
  pre_medidas: false,
  peso: true
})


function validate() {
  //validation.categoria = new_volume.categoria != null
  // validation.responsavel = new_volume.responsavel != null
  // validation.categoria = new_volume.categoria != null
  // validation.origem = new_volume.origem != null
  // validation.items = new_volume.items.length != 0
  // validation.destino = new_volume.destino != ''
  validation.peso = typeof volume_editado.value.peso == 'number' && volume_editado.value.peso > 0
  validation.medidas = validation.pre_medidas
}

function reset_validation() {
  // validation.categoria = true
  // validation.responsavel = true
  // validation.categoria = true
  // validation.origem = true
  // validation.items = true
  // validation.destino = true
  validation.peso = true
  validation.medidas = true
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



 

const simbolos_nbr_ordenados = computed(() => {
  const all = []
  for (const [key, value] of Object.entries(simbolos_nbr)) {
    all.push({ key, value })
  }
  return all.sort((a, b) => a.value.localeCompare(b.value))
})
 

/**
 * WATCHERS
 */
  

 


function valida_inteiros(key_event) {
  const digito_regex = /\d/g
  // Se precionar backspace, delete, tab, enter, arrow left ou arrow right, permite
  const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter']
  if (allowed.includes(key_event.key)) {
    return
  }
  // Se precionar qualquer outra coisa que não seja um dígito, não permite
  if (!digito_regex.test(key_event.key)) {
    key_event.preventDefault()
  }
} 
 

async function editar_volume() {
  const {peso, medidas, propriedades, observacao, embalagem} = toValue(volume_editado)
  const {campus, codigo} = toValue(localizacao_atual)
  const collectionRef = (campus == "Sul")? 'ambientes': 'ambientes-norte'

  const loc_atual = doc(db, `${collectionRef}/${codigo}`)
  const novos_dados = {peso, medidas, propriedades, localizacao_atual: loc_atual, observacao, embalagem}
  //console.log(JSON.stringify(novos_dados, null, 1)) 
  validate()
  for (const [key, value] of Object.entries(validation)) {
    // se alguma coisa não for válida, retorna zero
    if (value == false) {
      setTimeout(reset_validation, 1500)
      set_mensagem_popup("Preencha todos os campos em vermelho", "danger")
      return 0
    }
  }
  // se passou a validação
  const docRef = doc(db, "volumes", volume_editado.value.codigo)
  await updateDoc(docRef, novos_dados)

  set_mensagem_popup("Volume editado com sucesso", "success")
  router.push({name: 'volumes'}) 
}

onMounted(() => {
  items.ambiente = new_volume.origem
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

</script>

<template>
  <template v-if="pending">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col d-flex justify-content-end">
        <h1 class="flex-fill">Editar Volume {{ volume_editado.id }}</h1>
        <button class="btn btn-success" @click="editar_volume">Salvar</button>
      </div>
    </div>
    <form class="row g-3">
      <div class="col-6">
        <p class="mb-2"><b>Responsável:</b> {{ responsavel_label }}</p>
        <div class="hstack gap-2 mb-2">
          <p class="px-3 text-center mb-1"><b>Origem:</b> {{ volume_editado.origem.codigo }}</p>
          <i class="bi bi-arrow-right"></i>
          <p class="px-3 text-center mb-1"><b>Destino:</b> {{ volume_editado.destino ? volume_editado.destino.codigo : ""
          }} </p>
        </div>
        <p class="mb-2"><b>Categoria:</b> {{ volume_editado.categoria }}</p>

      </div>
      <div class="col-6"> 
        <p class="fw-bold mb-1">Lista de itens</p>
          <ul class="list-group">
            <li class="list-group-item justify-content-between d-flex text-lowercase px-2 py-1" v-for="item in volume_editado.items">
              <span>
                {{ item.descricao ? item.descricao : item.short_descricao }}
              </span>
              <span class="bagde text-dark">{{ item.key }}</span>
            </li>
          </ul>
      </div>

      <div class="col-6">
        <p class="fw-bold fs-5">Ambiente atual</p>
        <div class="form-check form-check-inline">
          <input v-model="localizacao_atual.campus" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Sul">
          <label class="form-check-label" for="inlineRadio1">Sul</label>
        </div>
        <div class="form-check form-check-inline">
          <input v-model="localizacao_atual.campus" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Norte">
          <label class="form-check-label" for="inlineRadio2">Norte</label>
        </div> 
        <SelectPlus @selected="x => localizacao_atual.codigo = x" 
         :valor="localizacao_atual.codigo" placeholder="Selecione o ambiente" 
         :options="lista_opcoes_ambientes"></SelectPlus> 
      </div>

      <div class="col-xs-12  col-md-6">
        <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Embalagem
        </p>
        <form>
          <div class="row mb-2">
            <label class="col-sm-3 col-form-label fw-medium" for="caixaSelect">Caixa</label>
            <div class="col-sm-9">
              <select id="caixaSelect" v-model="volume_editado.embalagem.caixa" class="form-select">
                <option v-for="caixa in caixas" :value="caixa.id">{{ caixa.label }}</option>
              </select>
            </div>
          </div>
          <div class="row  mb-2">
            <label class="col-sm-3  form-check-label fw-medium" for="plastico_bolha">Plástico Bolha</label>
            <div class="col-sm-9">
              <div class="input-group">
                <input placeholder="Quantos metros de plástico bolha são suficientes?" @keydown="valida_inteiros"
                  class="form-control" id="platico_bolha" v-model.number="volume_editado.embalagem.platico_bolha">
                <span class="input-group-text">m</span>
              </div>
            </div>
          </div>

          <div class="row  mb-2">
            <label class="col-sm-3  form-check-label fw-medium" for="enchimento">Enchimento</label>
            <div class="col-sm-9">
              <input class="form-check-input" type="checkbox" v-model="volume_editado.embalagem.enchimento"
                id="enchimento"><label class="ms-3 form-check-label form-text" for="enchimento">(Papel ou Isopor para
                preencher a caixa)</label>
            </div>
          </div>

        </form>
      </div>
      <div class="col-xs-12  col-md-6">
        <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Medidas
        </p>
        <div class="border rounded" :class="{ 'border-danger': !validation.medidas }">
          <MedidasInput :medidas="volume_editado.medidas" :inner_validate="true" @update="x => volume_editado.medidas = x"
            @validate="x => validation.pre_medidas = x"></MedidasInput>
        </div>
        <p class="mb-1 fw-bold d-flex justify-content-between fs-5">Peso
        </p>
        <div class="border rounded" :class="{ 'border-danger': !validation.peso }">
          <PesoInput :peso="volume_editado.peso" @update="x => volume_editado.peso = x"></PesoInput>
        </div>
      </div>

      <div class="col-xs-12 col-md-6">
        <label for="observacao" class="form-label fw-bold fs-5">Observação</label>
        <textarea class="form-control" id="observacao" rows="3" placeholder="Alguma obervação especial para esse volume?"
          v-model="volume_editado.observacao"></textarea>
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
                v-model="volume_editado.propriedades">
              <label class="form-check-label" :for="'props' + n">
                {{ item.key }}
              </label>
            </div>
          </div>
        </div>
      </div> 

    </form>
  </template>
</template>
<style>
.listatodositems {
  height: 30vh;
}
</style>