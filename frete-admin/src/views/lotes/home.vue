<script setup>
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import { collection, where, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import { db } from '@/backend/index'
import moment from 'moment';
import { reactive, computed, ref } from 'vue';
import { RouterLink } from "vue-router";
import { useUsuariosStore } from '@/stores/users';


const usuarios = useUsuariosStore()


const catRef = doc(db, 'agregados/categorias_volumes')
const { data: categorias, pending: cat_pending, promise: cat_promisse } = useDocument(catRef)

const { data: lista_ambientes, pending: amb_pending } = useDocument(doc(db, 'agregados/ambientes'))

const filtros = reactive({
  carregamento: null,
  responsavel: null,
  quantidade: 10
})


const carregamentos = ["Carregamento 1", "Carregamento 2", "Carregamento 3", "Carregamento 4"]




const lotRef = collection(db, "lotes")
const q = computed(() => {
  var composite_query = [];

  if (filtros.carregamento)
    composite_query.push(where('carregamento', '==', filtros.carregamento))

  if (filtros.responsavel)
    composite_query.push(where('responsavel', '==', doc(db, 'usuarios', filtros.responsavel)))

  if (filtros.quantidade)
    composite_query.push(limit(filtros.quantidade))

  return query(lotRef, ...composite_query, orderBy('data_criacao', 'desc'))
})

const lotes = useCollection(q, { wait: true, maxRefDepth: 2 })

const soft_volume_modal_ref = ref(null)

const volumes_selecionados = ref([])
</script>
<template>
  <div class="row">
    <div class="col">
      <h4>Filtrando os lotes</h4>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col">
      <label for="pessoa" class="form-label">Filtrar por responsável</label>
      <select v-if="!amb_pending" v-model="filtros.responsavel" id="pessoa" class="form-select">
        <option :value="null">Qualquer responsável</option>
        <option :value="usr.email" v-for="usr in usuarios.usuarios">
          {{ usr.nome }} &lt;{{ usr.email }}&gt;</option>
      </select>
    </div>
    <div class="col">
      <label for="carregamento" class="form-label">Filtrar por carregamento</label>
      <select v-if="!amb_pending" v-model="filtros.carregamento" id="carregamento" class="form-select">
        <option :value="null">Qualquer carregamento</option>
        <option v-for="carr in carregamentos">{{ carr }}</option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col d-flex justify-content-between">
      <h4>Exibindo lotes</h4>
    </div>
  </div>
  <div class="row justify-content-start">
    <div class="col">
      <table class="table table-sm d-print-table">

        <thead>
          <tr>
            <th>Lote</th>
            <th>Volumes</th>
            <th>Carregamento</th>
            <th>Criado em</th>
            <th>Data pronto</th>
            <th>Responsável</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="lote in lotes">
            <tr>
              <td> {{ lote.id }}</td>
              <td> <a :href="'#volumes' + lote.id" class="btn btn-sm btn-primary" data-bs-toggle="collapse" role="button"
                  aria-expanded="false" :aria-controls="'volumes' + lote.id">Ver volumes</a> </td>
              <td>
                {{ lote.carregamento }}
              </td>
              <td>
                {{ moment.unix(lote.data_criacao.seconds).format("DD/MM/YY") }}
              </td>
              <td>
                {{ moment.unix(lote.data_pronto.seconds).format("DD/MM/YY") }}
              </td>
              <td> {{ lote.responsavel.nome }}</td>
            </tr>
            <tr class="collapse" :id="'volumes' + lote.id">
              <td></td>
              <td colspan="4">
                <ul class="list-group">
                <template v-for="volume in lote.volumes">  
                  <li class="list-group-item d-flex justify-content-between">
                    <span>{{ volume.categoria }}</span>
                    <div class="hstack">
                    <AmbienteFlag v-bind="volume.origem"></AmbienteFlag><i class="mx-2 bi bi-arrow-right"></i>     <AmbienteFlag v-bind="volume.destino"></AmbienteFlag> 
                    </div>
                    <span class="badge bg-success">{{ volume.items.length == 1 ? volume.items.length + ' item' :  volume.items.length + ' itens'  }}</span>
                      <RouterLink :to="{name: 'volume-codigo', params: {codigo: volume.codigo}}" class="text-decoration-none text-success-emphasis">Ver volume <i class="bi bi-box-seam"></i></RouterLink> 
                      </li>
                    </template>
                  </ul>
              </td> 
              <td></td>
            </tr>
          </template>
        </tbody>
      <tfoot>
        <tr>
          <td colspan="2">
            <div class="form-floating">
            <select id="quantidade" v-model="filtros.quantidade" class="form-select">
              <option v-for="x in 5" :value="x*5">{{ x*5 }}</option>
              <option :value="null">Todos</option>
            </select>
            <label for="quantidade">Exibir quantos registros</label>
            </div>
          </td>
          <td colspan="4"></td> 
        </tr>
      </tfoot>
      </table>
    </div>
  </div>
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
 