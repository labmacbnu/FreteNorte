<script setup>
import { useAmbientesStore, ambiente_status } from '@/stores/ambientes';
import { useUserPermissionsStore } from '@/stores/user';
import { RouterLink } from 'vue-router';
import { computed, ref, reactive, onMounted } from 'vue'; 



const ambientes = useAmbientesStore()
const permissions = useUserPermissionsStore()


const meus_ambientes = computed(() => {

    const lista_ambientes = reactive([])
    if (permissions.ambientes) {
        lista_ambientes.push(...ambientes.dados.filter(
            obj => permissions.ambientes.includes(obj.ambiente_codigo) || 
            permissions.usuario_de.includes(obj.ambiente_codigo)
        ))

        lista_ambientes.forEach(async (ambiente, index) => {
            const dicio = await ambiente_status(ambiente.ambiente_codigo)
            dicio.percent = parseInt(100* dicio.volumados / dicio.todos)
            lista_ambientes[index]["status"] = reactive(dicio)
        })
    }
    return lista_ambientes
}) 
</script>

<template>
    <div class="row my-3">
        <div class="col">
            <h1>SisLog Norte</h1>
            <p> Sistema de controle da logística da mudança do campus Blumenau.</p>
            <h2>Seus ambientes</h2>
            <div class="my-3">
                <div class="card my-2" v-for="(x, i) in meus_ambientes">
                    <div class="card-body" v-if="x">
                        <h5 class="card-title">{{ x.ambiente_codigo }}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{{ x.ambiente_nome }}</h6>
                        <p class="card-text">
                        <div v-if="x.status" class="progress" role="progressbar" aria-label="Default striped example"
                            :aria-valuenow="x.status.volumados" aria-valuemin="0" :aria-valuemax="x.status.todos">
                            <div class="progress-bar progress-bar-striped" :style="{ width: x.status.percent + '%' }">
                                {{ x.status.volumados }} de {{ x.status.todos }} volumados</div>
                        </div>
                        </p>
                        <RouterLink :to="{ name: 'items-ambiente', params: { ambiente: x.ambiente_codigo } }">Ver ambiente
                        </RouterLink>
                    </div>
                </div>


            </div>

        </div>
    </div>
</template>
