<script setup>
import { useAmbientesUserStore } from '@/stores/ambientes';
import { useUserPermissionsStore } from '@/stores/user';
import { RouterLink } from 'vue-router';
import {  onMounted, } from 'vue';  
import ProgressBar from '@/components/ProgressBar.vue';
 
const permissions = useUserPermissionsStore()


const meus_ambientes = useAmbientesUserStore()
 
onMounted( () => {
    meus_ambientes.update_stats()
})  
</script>

<template>
    <div class="row my-3">
        <div class="col">
            <h1>SisLog Norte</h1>
            <p> Sistema de controle da logística da mudança do campus Blumenau.</p>
            <h2>Seus ambientes <span v-if="meus_ambientes.dados" class="text-secondary">({{ meus_ambientes.dados.length }})</span></h2>
            <div class="my-3">
                <div class="card my-2" v-for="(x, i) in meus_ambientes.dados">
                    <div class="card-body" v-if="x">
                        <h5 class="card-title">{{ x.codigo }}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{{ x.nome }}</h6>
                        <p class="card-text">
                            <ProgressBar v-if="meus_ambientes.status[x.codigo]" :atual="meus_ambientes.status[x.codigo].volumados" :maximo="meus_ambientes.status[x.codigo].todos" :percentual="meus_ambientes.status[x.codigo].percent"></ProgressBar>
                        </p>
                        <div class="d-flex flex-row justify-content-between">
                        <RouterLink :to="{ name: 'items-ambiente', params: { ambiente: x.codigo } }"><i class="bi bi-clipboard-check"></i> Ver itens desse ambiente
                        </RouterLink>
                        <RouterLink :to="{name: 'volumes-ambiente', params: { ambiente: x.codigo } }">Ver volumes desse ambiente <i class="bi bi-box-seam"></i></RouterLink>

                        </div>
                    </div>
                </div>


            </div>

        </div>
    </div>
</template>
