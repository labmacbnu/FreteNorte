<script setup>
import ModalDelete from "@/components/ModalDelete.vue"
import { collection, where, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import { db } from '@/backend/index'
import moment from 'moment';
import { reactive, computed, ref } from 'vue';
import { RouterLink } from "vue-router";
import { useUsuariosStore } from '@/stores/users';


const usuarios = useUsuariosStore() 


const catRef = doc(db, 'agregados/categorias_volumes')
const {data: categorias, pending: cat_pending, promise: cat_promisse } = useDocument(catRef)

const {data: lista_ambientes, pending: amb_pending} = useDocument(doc(db, 'agregados/ambientes'))

const filtros = reactive({
  categoria: null,
  origem: null, 
  responsavel: null,
  status: null,
  quantidade: 10
})

 



const lotRef = collection(db, "lotes")
const q = computed(()=> {
  var composite_query = [];

  if(filtros.responsavel)
    composite_query.push( where('responsavel', '==', doc(db, 'usuarios', filtros.responsavel)) )

  return query(lotRef,...composite_query, orderBy('data_criacao', 'desc'), limit(filtros.quantidade))
})

const lotes = useCollection(q, {wait: true, maxRefDepth: 1})

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
            <th>Carregamento</th> 
            <th>Criado em</th> 
            <th>Data pronto</th>
            <th>Responsável</th>
        </tr>
        </thead>
        <tbody>
          <template  v-for="lote in lotes">
          <tr>   
            <td>
              {{ lote.carregamento }}
            </td>
            <td>
              {{ moment.unix(lote.data_criacao.seconds).format("DD/MM/YY")   }}
            </td>
            <td>
              {{ moment.unix(lote.data_pronto.seconds).format("DD/MM/YY")  }}
            </td>   
            <td> {{ lote.responsavel.nome }}</td>
          </tr>  
      </template>
      </tbody>
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
 