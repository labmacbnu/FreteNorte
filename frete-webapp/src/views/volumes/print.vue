<script setup>
import { inject, } from 'vue'; 
import ModalDelete from '@/components/ModalDelete.vue';
import {   useVolumesEmailStore } from '@/stores/volumes';
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import StatusList from '@/components/StatusList.vue';
import VMedidasDisplay from '@/components/VMedidasDisplay.vue';
import moment from 'moment';
 
import { RouterLink } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser") 
 
 
const volumes = useVolumesEmailStore()

function click_row(i) {
  document.getElementById("check" + i).click()
}

 
function imprimir() {
  window.print()
}
 

</script>

<template> 
<div class="row">
  <div class="col">
    <RouterLink :to="{ name: 'volumes' }" class="d-print-none"><i class="bi-arrow-left bi"></i> Voltar para volumes</RouterLink>
  </div>
</div>
  <div class="row mb-1">
    <div class="col">
      <h4>Volumes criados por {{ globaluser.displayName }}</h4>
    </div>  
    <div class="col text-end"> 
        <a class="fs-4 d-print-none" href="#" @click="imprimir"><i class="bi-printer bi"></i> Imprimir</a> 
    </div>
  </div>
  <div class="row">
    <div class="col">
      <table class="table d-print-table align-middle">
        <thead>
          <tr> 
            <th class="">Código</th> 
            <th>Itens</th>
            <th>Origem</th> 
            <th>Destino</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Criado</th> 
            <th>Medidas</th>
            <th>Peso</th>
            <th>Observações</th>
        </tr>
        </thead>
        <tbody>
          <template  v-for="volume in volumes.dados" :key="'volume' + volume.codigo">
          <tr> 
            <td class="text-wrap text-break volume-codigo fs10" >  
              {{ volume.codigo }} 
            </td> 
            <td>  
            <ul class="list-group list-group-flush">
              <template  v-for="item in volume.items"> 
                <li v-if="item" class="list-group-item justify-content-between d-flex">
                    <small class="fs10">{{ item.short_descricao }}</small>
                    <small class="span-lista-volumes fs10">{{item.key}}</small>
                  </li> 
              </template>
              </ul> 
            </td>
            <td class="text-center"><AmbienteFlag v-bind="volume.origem"></AmbienteFlag></td> 
            <td><AmbienteFlag v-bind="volume.destino"></AmbienteFlag></td>
            <td>{{ volume.categoria }}</td>
            <td><StatusList :status="volume.status"></StatusList></td>
            <td>{{ moment.unix(volume.data_criacao.seconds).format("DD/MM/YY") }}</td>  
            <td><VMedidasDisplay v-bind="volume.medidas"></VMedidasDisplay></td>
            <td>{{ volume.peso }}<span v-if="volume.peso">kg</span></td>
            <td>{{ volume.observacoes }}</td>
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
.volume-codigo {
  width: 8em;
}

.fs10 {
  font-size: 10pt;
}

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
 