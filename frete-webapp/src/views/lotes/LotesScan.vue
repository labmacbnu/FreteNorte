<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useLotesStore } from '@/stores/lotes';

import QRCodeReader from '@/components/QRCodeReader.vue';
const router = useRouter()


const lotes = useLotesStore()
const mensagem = ref("Lote lido com sucesso!")


function update_url(new_url) {
  const prefix = "https://frete-norte-ufsc-blumenau.web.app/volumes/cod/"
  if (new_url.startsWith(prefix)) {
    const codVolume = new_url.replace(prefix, "")
    if (!lotes.volumesCods.includes(codVolume)) {
      mensagem.value = "Lote lido com sucesso!"
      lotes.addVolume(codVolume)
    } else {
      mensagem.value = "Volume já lido"
    }
  } else {
    mensagem.value = "URL inválida"
  }
}
</script>

<template>
  <div class="row">
    <div class="col mb-3">
      <h1>Criando um lote</h1>
      <p>Leia os QRCodes para adicionar os volumes nesse lote. Clique em Próximo para designar o caminhão que levará o lote.</p>
      <QRCodeReader :autoreload="true" @decoded="update_url">
        <p>{{ mensagem }}</p>
      </QRCodeReader>
    </div>
  </div>
  <div class="row justify-content-between">
    <div class="col-sm-12 col-lg-5">
      <h2>Volumes desse lote</h2>
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="l in lotes.volumesCods">
          {{ l }}
          <span @click="() => lotes.removeVolume(l)" class="badge text-bg-danger rounded-pill"><i class="bi bi-trash"></i></span>
        </li>
      </ul>
    </div>
    <div class="col-lg-5 col-sm-12 text-center p-3">
      <RouterLink :to="{name: 'lotes-carregamento'}" class="btn btn-primary">Próximo<i class="bi bi-caret-right"></i></RouterLink>

    </div>
  </div>
</template>
