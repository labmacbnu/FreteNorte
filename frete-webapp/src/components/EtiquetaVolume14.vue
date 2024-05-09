<script setup>
import QRCode from './QRCodeS.vue';
import AmbienteFlag from './AmbienteFlag.vue';
import  QuadradoColorido from './QuadradoColorido.vue';
import  provisorios  from './provisorios.json';

defineProps({
  volume: {
    type: Object,
    required: true
  }
}) 

function find_destino(codigo){
  return provisorios.alocacoes[codigo]
}

const COLOR1 = {
  '0E': 'blue',
  '0D': 'red',
  '1E': 'yellow',
  '1D': 'black',
}

function cor1(destino){
  const amb_destino = provisorios.ambientes[destino]
  return COLOR1[`${amb_destino.andar}${amb_destino.lado}`]
}

function cor2(destino){  
  return provisorios.ambientes[destino].cor
}

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
      <i class="bi bi-arrow-down">{{ find_destino(volume.origem.codigo) }}</i>
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
        <QuadradoColorido :cor1=" cor1(find_destino(volume.origem.codigo))" :cor2="cor2(find_destino(volume.origem.codigo))" altura="1cm"></QuadradoColorido>
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