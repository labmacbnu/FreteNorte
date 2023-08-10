<script setup>
import ModalDelete from "@/components/ModalDelete.vue"
import { collection, where, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import { db } from '@/backend/index'
import moment from 'moment';
import { reactive, computed, ref } from 'vue';
import { RouterLink } from "vue-router";

const catRef = doc(db, 'agregados/categorias_volumes')
const {data: categorias, pending: cat_pending, promise: cat_promisse } = useDocument(catRef)

const {data: lista_ambientes, pending: amb_pending} = useDocument(doc(db, 'agregados/ambientes'))

const filtros = reactive({
  categoria: null,
  origem: null, 
  quantidade: 10
})


cat_promisse.value.then(() => filtros.categoria = categorias.value.valores[0])



const volRef = collection(db, "volumes")
const q = computed(()=> {
  var composite_query = [];

  if(filtros.categoria)
    composite_query.push( where('categoria', '==', filtros.categoria))
  
  if(filtros.origem)
    composite_query.push( where('origem', '==', doc(db, 'ambientes', filtros.origem)))

  return query(volRef,...composite_query,  where('deleted', '==', false), orderBy('data_criacao', 'desc'), limit(filtros.quantidade))
})

const volumes = useCollection(q, {wait: true})

const soft_volume_modal_ref = ref(null)
</script>
<template> 
<div class="row mb-3">
  <div class="col">
    <label class="form-label" for="categoria">
      Filtrar por categoria
    </label>
    <select v-model="filtros.categoria" id="categoria" class="form-select" v-if="!cat_pending">
      <option v-for="categoria in categorias.valores">
        {{categoria}}
      </option>
    </select>
    <p class="text-end mt-1"><RouterLink class="text-info text-decoration-none" 
      :to="{name: 'volumes-edita-categorias'}">
      Editar categorias <i class="bi bi-pencil"></i></RouterLink></p>
  </div>
  <div class="col">
    <label for="ambiente" class="form-label">Filtrar por ambiente de origem</label>
    <select v-if="!amb_pending" v-model="filtros.origem" id="ambiente" class="form-select">
      <option v-for="amb in lista_ambientes.liderados">
      {{ amb }}</option>
    </select>
  </div>
</div>
  <div class="row justify-content-start">
    <div class="col">
      <table class="table table-sm d-print-table">
        <thead>
          <tr> 
            <th class="d-print-none">Código</th>
            <th>Lista de items</th>
            <th>Origem</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Localização atual</th>
            <th>Criado em</th>
            <th>Criado por</th>
            <th class="d-print-none"></th>
        </tr>
        </thead>
        <tbody tag="tbody" name="tabela" is="transition-group">
          <template  v-for="volume in volumes" :key="'volume' + volume.codigo">
          <tr>
            <td>{{ volume.codigo.substring(0,8)+'...' }}</td>
            <td> 
              <a :href="'#items' + volume.codigo"  class="btn btn-primary" data-bs-toggle="collapse" 
                role="button" aria-expanded="false" :aria-controls="'items' + volume.codigo">
              Ver items</a>
            </td>
            <td>
              {{ volume.origem.ambiente_codigo }}
            </td>
            <td>
              {{ volume.categoria }}
            </td>
            <td>
              {{ volume.status }}
            </td>
            <td>
              {{ volume.localizacao_atual.ambiente_codigo }}
            </td>
            <td>
              {{ moment.unix(volume.data_criacao.seconds).format("DD/MM/YY") }}
            </td>  
            <td>

              {{ volume.responsavel.nome }} &lt;{{ volume.responsavel.id }}&gt;
            </td>
            <td class="d-print-none">
              <button class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal" 
              @click="() => soft_volume_modal_ref = volume.codigo"><i class="bi bi-trash" title="Apagar volume"></i></button>
            </td>
          </tr>
          <tr class="collapse" :id="'items' + volume.codigo">
            <td colspan="5">
            <ul class="list-group list-group-flush align-top">
                <li v-for="item in volume.items" :key="'I' + item.key" class="list-group-item justify-content-between d-flex">
                  <small class="" v-if="item.key">{{ item.short_descricao }}</small>
                  <span class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</span>
                </li> 
              </ul>
            </td>
            <td colspan="4"></td>
          </tr>
      </template>
      </tbody>
      </table>
    </div>
  </div>


<ModalDelete modalid="apagare" :delete_callback="() => soft_apaga_volume(soft_volume_modal_ref)">
<template #titulo>
  Apagar volume
</template>
<template #corpo>
  Certeza que quer apagar o volume {{soft_volume_modal_ref}}?
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

.tabela-item {
  transition: all 1s;
}
.tabela-item > tr >* {
  transition: all 1s;
  overflow: hidden;
}
.tabela-enter > td {
  line-height: 0 !important;
}
.tabela-enter > tr > * {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

</style>
 