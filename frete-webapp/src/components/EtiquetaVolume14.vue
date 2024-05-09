<script setup>
import QRCode from './QRCodeS.vue';
import AmbienteFlag from './AmbienteFlag.vue';
defineProps({
  volume: {
    type: Object,
    required: true
  }
})
</script>
<template>
<div class="etiqueta py-1">  
  <div class="hstack">
    <!-- QRCOde -->
    <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode> 
    <!-- Transporte  -->
    <div class="vstack ms-1 caminho align-items-center justify-content-center">
      <i class="bi bi-truck d-inline"></i> 
      <AmbienteFlag v-bind="volume.origem"></AmbienteFlag>
      <i class="bi bi-arrow-down"></i>
       <AmbienteFlag v-bind="volume.destino"></AmbienteFlag>
    </div>
    <!-- Conteudo -->
    <div class="conteudo">
      <div class="stack">
        <div class="c-titulo text-lowercase text-truncate">
          {{volume.items[0].short_descricao}}
        </div>
        <div class="text-truncate c-codigo">
          {{volume.items[0].id}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
.etiqueta{
  width: 101.6mm;
  height: 33.9mm;
  display: inline-block;    
}
/* .caminho {  
  border: 0.5px solid rgb(221, 48, 48);
} */
.conteudo{
  font-size: 12pt;
  text-align: center;
  margin-top: 0ex;
  width: 50mm;
}
.c-titulo{
  font-size: 12pt;
  font-weight: bold;
}
.c-codigo{
  font-size: 10pt;
}
</style>