<script setup>
import { onBeforeMount, ref, computed } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import Modal from '../components/Modal.vue';
import { useUsuariosStore } from '../stores/users';

const usuarios = useUsuariosStore()

const ambientes = useAmbientesStore()
const pesquisa = ref(null)

const ambientes_filtrados = computed(() => {
    const lista_ambientes = ambientes.dados
    if (pesquisa.value) {
        const regex = new RegExp(`.*${pesquisa.value}.*`, 'i')
        const filtrado = lista_ambientes.filter(elem => regex.test(elem.valor) || regex.test(elem.lider))
        return filtrado
    } else {
        return lista_ambientes
    }
})

const selected_ambiente_key = ref(null)

const selected_ambiente = computed( () => {
    if(selected_ambiente_key.value && ambientes.dados) {
        const filtrado = ambientes.dados.filter(elem => elem.ambiente_codigo == selected_ambiente_key.value)
        return filtrado[0]
    } else {
        return {ambiente_codigo: '', ambiente_nome: '', tipo: "Físico"}
    }
})

 

</script>

<template>
    <datalist id="lista_usuarios">
        <option v-for="(value, key) in usuarios.usuarios">{{ key }}</option>
    </datalist>
    <h1>Ambientes</h1>
    <button class="btn btn-success" data-bs-target="#criaAmbiente" data-bs-toggle="modal">Criar ambiente virtual</button>

    <Modal modalid="criaAmbiente">
         <template #titulo>
            Criar ambiente
         </template>
         <template #corpo>
            Nobo novme
         </template>

    </Modal>

    <Modal modalid="adicionaLider">
         <template #titulo>
            Adicionar líder
         </template>
         <template #corpo>
            <div class="mb-3">
                <label for="codigo" class="form-label">Código</label>
                <input :value="selected_ambiente.ambiente_codigo" type="text" class="form-control" id="codigo" disabled>
            </div>

            <div class="mb-3">
                <label for="ambiente" class="form-label">Ambiente</label>
                <input :value="selected_ambiente.ambiente_nome" type="text" class="form-control" id="ambiente" disabled>
            </div>

            <div class="mb-3">
                <label for="ambtipo" class="form-label">Tipo</label>
                <input id="ambtipo"  type="text" :value="selected_ambiente.tipo" class="form-control"  disabled>
            </div>

            <div class="mb-3">
                <label for="amblider" class="form-label">Líder</label>
                <input id="amblider"  type="text" v-model="selected_ambiente.lider" class="form-control"  list="lista_usuarios">
            </div>
 
         </template>

    </Modal>

    <table class="table">
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th class="text-center">Líder</th>
                <th># items</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="5"><input v-model="pesquisa" placeholder="Digite para pesquisar" class="form-control">
                </td>
            </tr>
            <tr v-for="amb in ambientes_filtrados">
                <td>{{ amb.ambiente_codigo }}</td>
                <td>{{ amb.ambiente_nome }}</td>
                <td>{{ amb.tipo }}</td>
                <td class="text-center"><template v-if="amb.lider"><code>{{amb.lider}}</code></template>
                    <template v-else><button class="btn btn-primary btn-sm"
                         data-bs-target="#adicionaLider" data-bs-toggle="modal" 
                         title="Adicionar líder" @click="() => selected_ambiente_key = amb.ambiente_codigo"><i class="bi bi-plus"></i></button></template>
                </td>
                <td>{{ amb.items }}</td>
            </tr>
        </tbody>
    </table>
</template>