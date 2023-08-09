<script setup>

import { collection, where, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { db } from '@/backend/index'
import moment from 'moment';

const volRef = collection(db, "volumes")
const q = query(volRef, where('deleted', '==', false), orderBy('data_criacao', 'desc'))
const volumes = useCollection(q, {wait: true})

</script>
<template> 

  <div class="row justify-content-start">
    <div class="col p-0">
      <table class="table d-print-table align-middle">
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
            <td colspan="1"></td>
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
 