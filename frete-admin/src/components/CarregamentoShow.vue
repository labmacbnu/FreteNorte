<template>
<div class="card m-2" >
  <div class="card-body">
    <h5 class="card-title">{{carregamento.id}}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">{{formata_data(carregamento.data_saida)}}</h6>
    <p class="card-text">
       
    </p> 
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item  d-flex justify-content-between align-items-center">
        Caminhão<span class="badge bg-secondary">{{carregamento.caminhao.placa}}</span>
    </li>
    <li class="list-group-item  d-flex justify-content-between align-items-center">
        Status<span class="badge bg-secondary">{{carregamento.status}}</span>
    </li> 
    <li class="list-group-item  d-flex justify-content-between align-items-center">
        Saída<span class="badge bg-secondary">{{carregamento.saida}}</span>
    </li> 
  </ul>
</div>
</template>
<script setup>
import moment from 'moment';

function formata_data(data){
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY")
}

defineProps({
  carregamento: Object
});
</script>