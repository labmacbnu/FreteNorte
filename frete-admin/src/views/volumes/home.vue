<script setup>
import ModalDelete from "@/components/ModalDelete.vue"
import { collection, where, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import { db } from '@/backend/index'
import AmbienteFlag from "@/components/AmbienteFlag.vue";
import StatusList from "@/components/StatusList.vue";
import moment from 'moment';
import { reactive, computed, ref } from 'vue';
import { RouterLink } from "vue-router";
import { useUsuariosStore } from '@/stores/users'; 


const usuarios = useUsuariosStore()


const catRef = doc(db, 'agregados/categorias_volumes')
const { data: categorias, pending: cat_pending, promise: cat_promisse } = useDocument(catRef)

const { data: lista_ambientes, pending: amb_pending } = useDocument(doc(db, 'agregados/ambientes'))

const filtros = reactive({
  categoria: null,
  origem: null,
  responsavel: null,
  status: [],
  quantidade: 10
})
 




const volRef = collection(db, "volumes")
const q = computed(() => {
  var composite_query = [];

  if (filtros.categoria)
    composite_query.push(where('categoria', '==', filtros.categoria))

  if (filtros.origem)
    composite_query.push(where('origem', '==', doc(db, 'ambientes', filtros.origem)))

  if (filtros.responsavel)
    composite_query.push(where('responsavel', '==', doc(db, 'usuarios', filtros.responsavel)))

  if (filtros.status && filtros.status.length > 0)
    composite_query.push(where('status', 'array-contains-any', filtros.status))

  if (filtros.quantidade)
    composite_query.push(limit(filtros.quantidade))

  return query(volRef, ...composite_query, where('deleted', '==', false), orderBy('data_criacao', 'desc'))
})

const volumes = useCollection(q, { wait: true, maxRefDepth: 1 })

const soft_volume_modal_ref = ref(null)

const volumes_selecionados = ref([])
</script>
<template>
  <div class="row">
    <div class="col">
      <h4>Filtrando os volumes</h4>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col">
      <label class="form-label" for="categoria">
        Filtrar por categoria
      </label>
      <select v-model="filtros.categoria" id="categoria" class="form-select" v-if="!cat_pending">
        <option :value="null">Todas</option>
        <option v-for="categoria in categorias.valores">
          {{ categoria }}
        </option>
      </select>
      <p class="text-end mt-1">
        <RouterLink class="text-info text-decoration-none" :to="{ name: 'volumes-edita-categorias' }">
          Editar categorias <i class="bi bi-pencil"></i></RouterLink>
      </p>
    </div>
    <div class="col">
      <label for="ambiente" class="form-label">Filtrar por ambiente de origem</label>
      <select v-if="!amb_pending" v-model="filtros.origem" id="ambiente" class="form-select">
        <option :value="null">Qualquer ambiente</option>
        <option v-for="amb in lista_ambientes.liderados">
          {{ amb }}</option>
      </select>
    </div>
    <div class="col">
      <label for="pessoa" class="form-label">Filtrar por responsável</label>
      <select v-if="!amb_pending" v-model="filtros.responsavel" id="pessoa" class="form-select">
        <option :value="null">Qualquer responsável</option>
        <option :value="usr.email" v-for="usr in usuarios.usuarios">
          {{ usr.nome }} &lt;{{ usr.email }}&gt;</option>
      </select>
    </div>
    <div class="col"><p>Status: 
      <span v-for="status in filtros.status">{{ status }}</span>
    </p>
      <div class="dropdown">
        <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
          data-bs-auto-close="outside">
          Status {{ filtros.status.length ? '(' + filtros.status.length + ')' : ''  }}
        </button>
        <form class="dropdown-menu p-2">
          <div class="form-check" v-for="(status, n) in ['Criado', 'Loteado']" :key="'statusdiv' +  n">
            <input v-model="filtros.status" class="form-check-input" type="checkbox" :value="status" :id="'stat' + n">
            <label class="form-check-label" :for="'stat' + n">
              {{status}} 
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col d-flex justify-content-between">
      <h4>Exibindo os volumes</h4>
      <RouterLink :to="{ name: 'lotes-add', query: { volumes: volumes_selecionados } }" class="btn btn-lg btn-success">
        <i class="bi bi-boxes me-2"></i>Criar Lote
      </RouterLink>
    </div>
  </div>
  <div class="row justify-content-start">
    <div class="col">
      <table class="table table-sm d-print-table">
        <caption>Selecione os volumes e clique em Criar Lote</caption>

        <thead>
          <tr>
            <th class="d-print-none">Código</th>
            <th>Lista de items</th>
            <th>Origem</th>
            <th>Atual</th>
            <th>Destino</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Criado em</th>
            <th>Criado por</th>
            <th class="d-print-none"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="volume in volumes" :key="'volume' + volume.codigo">
            <tr>
              <td>
                <div class="form-check text-center text-wrap text-break text-secondary volume-codigo ">
                  <input :id="'volcheck' + volume.codigo" class="form-check-input" type="checkbox" :value="volume.codigo"
                    v-model="volumes_selecionados">
                  <label :for="'volcheck' + volume.codigo" class="form-check-label">{{ volume.codigo }}</label>
                </div>
              </td>
              <td>
                <a :href="'#items' + volume.codigo" class="btn btn-sm btn-primary" data-bs-toggle="collapse" role="button"
                  aria-expanded="false" :aria-controls="'items' + volume.codigo">
                  Ver itens</a>
              </td>
              <td>
                <AmbienteFlag v-bind="volume.origem"></AmbienteFlag>
              </td>
              <td>
                <AmbienteFlag v-bind="volume.localizacao_atual"></AmbienteFlag>
              </td>
              <td>
                <AmbienteFlag v-bind="volume.destino"></AmbienteFlag>
              </td>
              <td>
                {{ volume.categoria }}
              </td>
              <td>
                <StatusList :status="volume.status"></StatusList>
              </td>
              <td>
                {{ moment.unix(volume.data_criacao.seconds).format("DD/MM/YY") }}
              </td>
              <td>
                {{ volume.responsavel.nome }} 
              </td>
              <td class="d-print-none">
                <RouterLink :to="{ name: 'volume-codigo', params: { codigo: volume.codigo } }"
                  class="text-decoration-none text-success-emphasis">Ver volume <i class="bi bi-box-seam"></i>
                </RouterLink>
                <!-- <button class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal" 
              @click="() => soft_volume_modal_ref = volume.codigo"><i class="bi bi-trash" title="Apagar volume"></i></button> -->
              </td>
            </tr>
            <tr class="collapse" :id="'items' + volume.codigo">
              <td colspan="5">
                <ul class="list-group list-group-flush align-top">
                  <li v-for="(item, i) in volume.items" :key="'I' + i"
                    class="list-group-item justify-content-between d-flex">
                    <small>{{ item.short_descricao }}</small>
                    <span class="badge text-primary rounded-pill span-lista-volumes">{{ item?.key }}</span>
                  </li>
                </ul>
              </td>
              <td colspan="4"></td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">
              <div class="form-floating">
                <select id="quantidade" v-model="filtros.quantidade" class="form-select">
                  <option v-for="x in 5" :value="x * 5">{{ x * 5 }}</option>
                  <option :value="null">Todos</option>
                </select>
                <label for="quantidade">Exibir quantos registros</label>
              </div>
            </td>
            <td colspan="7"></td>
          </tr>
        </tfoot>
      </table>
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

.span-lista-volumes {
  width: 6em;
}

.volume-codigo {
  width: 6.5em;
  font-size: x-small;
}
</style>
 