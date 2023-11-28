<script setup>
import QRCode from './QRCode.vue';
import AmbienteFlag from './AmbienteFlag.vue';
defineProps({
  volume: {
    type: Object,
    required: true
  }
})
</script>
<template>
<div class="card my-1 mx-1" style="width: 200px">
    <div class="card-header p-1 text-center"> 
        <small>{{ volume.codigo }}</small>
    </div>
  <div class="card-body p-1">
    <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item text-lowercase p-1" >
        {{ volume.items[0].short_descricao }} ({{ volume.items[0].key }})
    </li> 
    <li class="list-group-item text-center">
        <div class="hstack">
          <i class="bi bi-truck me-1"></i>
            <AmbienteFlag  v-bind="volume.origem" />
            <i class="bi bi-arrow-right mx-2"></i>
            <AmbienteFlag  v-bind="volume.destino" />
        </div>
    </li> 
  </ul>
  <div class="card-footer text-end">
    Etiqueta SisLog
  </div>
</div>
</template>