<script setup>
import { onBeforeMount, ref, computed, reactive, watch } from 'vue';
import { useAmbientesStore, create_ambiente, add_lider_ambiente } from '../stores/ambientes';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { useUsuariosStore } from '../stores/users';
import { useRoute } from 'vue-router'
import { useDocument } from 'vuefire';
import { db } from '@/backend/index';
import { doc } from 'firebase/firestore'

const usuarios = useUsuariosStore()
const route = useRoute()


const lista_emails = computed(() => {
    const lista_emails = Object.keys(usuarios.usuarios)
    return lista_emails
})

const edificio = ref(route.query.edificio || null)
const lista_edificios = useDocument(doc(db, 'agregados/edificios'))

const ambientes = useAmbientesStore()
const pesquisa = ref(null)

watch(edificio, (newval) => {
    ambientes.edificio = newval
})

const ambientes_filtrados = computed(() => {
    const lista_ambientes = ambientes.dados.filter(elem => elem.edificio == edificio.value)
    if (pesquisa.value) {
        const regex = new RegExp(`.*${pesquisa.value}.*`, 'i')
        const filtrado = lista_ambientes.filter(elem => regex.test(elem.valor) || regex.test(elem.lider))
        return filtrado
    } else {
        return lista_ambientes
    }
})

const selected_ambiente_key = ref(null)

const selected_ambiente = computed(() => {
    if (selected_ambiente_key.value && ambientes.dados) {
        const filtrado = ambientes.dados.filter(elem => elem.codigo == selected_ambiente_key.value)
        return filtrado[0]
    } else {
        return { codigo: '', nome: '', tipo: "Físico" }
    }
})

const novo_ambiente = reactive({
    codigo: null,
    nome: null,
    items: 0,
    lider: null,
    tipo: "Virtual",
    campus: "Virtual",
    edificio: "Virtual"

})

const vald_n_ambiente = reactive({
    codigo: true,
    nome: true,
    items: true,
    lider: true,
    tipo: true
})


async function cria_ambiente() {
    // valida se o lider esta na lista de usuarios
    vald_n_ambiente.lider = lista_emails.value.includes(novo_ambiente.lider)
    // valida se codigo e nomes não são nulos
    for (let key of ['codigo', 'nome']) {
        vald_n_ambiente[key] = novo_ambiente[key] != null
    }
    // se tudo estiver ok, todas as vald_n_ambiente são true
    const tudook = Object.values(vald_n_ambiente).reduce((x, y) => x && y, true)
    if (tudook) {
        // se tudo ok 
        const uptime = await create_ambiente(novo_ambiente)
        console.log(`Ambiente ${novo_ambiente.codigo} criado`, uptime)
        // reseta objetos
        Object.assign(novo_ambiente, { codigo: null, nome: null, lider: null })
        Object.assign(vald_n_ambiente, { codigo: true, nome: true, items: true, lider: true, tipo: true })
        return true
    } else {
        return false
    }
}

const new_leader = reactive({
    valido: false
})

async function adiciona_lider() {
    const codigo = selected_ambiente.value.codigo
    const lider = selected_ambiente.value.lider
    new_leader.valido = lista_emails.value.includes(lider)
    if (new_leader.valido) {
        const uptime = await add_lider_ambiente(codigo, lider)
        console.log(`Líder ${lider} adicionado ao ambiente ${codigo}`, uptime)
        new_leader.email = null
        new_leader.valido = false
        return true
    } else {
        return false
    }
}

</script>

<template>
    <datalist id="lista_usuarios">
        <option v-for="email in lista_emails">{{ email }}</option>
    </datalist>

    <div class="row mb-3">
        <div class="col">
            <label class="form-label" for="edificio">Edifício</label>
            <select class="form-select" v-model="edificio" id="edificio">
                <option v-if="lista_edificios" v-for="edif in lista_edificios.edificios">{{ edif }}</option>
            </select>
        </div>
    </div>
    <h1>Ambientes</h1>
    <button class="btn btn-success" data-bs-target="#criaAmbiente" data-bs-toggle="modal">Criar ambiente virtual</button>
    <Modal modalid="criaAmbiente" :salve_callback="cria_ambiente">
        <template #titulo>
            Criar ambiente
        </template>
        <template #corpo>
            <div class="mb-3">
                <label for="novocodigo" class="form-label">Código</label>
                <input v-model="novo_ambiente.codigo" type="text" class="form-control" id="novocodigo"
                    :class="{ 'border-danger': !vald_n_ambiente.codigo }"
                    placeholder="Digite um código curto para identificar o ambiente">
            </div>

            <div class="mb-3">
                <label for="novonome" class="form-label">Ambiente</label>
                <input v-model="novo_ambiente.nome" type="text" class="form-control"
                    :class="{ 'border-danger': !vald_n_ambiente.nome }" id="novonome"
                    placeholder="Digite o nome do ambiente">
            </div>

            <div class="mb-3">
                <label for="novotipo" class="form-label">Tipo</label>
                <input v-model="novo_ambiente.tipo" id="novotipo" class="form-control" disabled>
            </div>

            <div class="mb-3">
                <label for="novolider" class="form-label">Líder</label>
                <input v-model="novo_ambiente.lider" id="novolider" type="text"
                    :class="{ 'border-danger': !vald_n_ambiente.lider }" class="form-control" list="lista_usuarios"
                    placeholder="Defina um líder para esse ambiente">
            </div>
        </template>

    </Modal>

    <Modal modalid="adicionaLider" :salve_callback="adiciona_lider">
        <template #titulo>
            Adicionar líder
        </template>
        <template #corpo>
            <div class="mb-3">
                <label for="ambcodigo" class="form-label">Código</label>
                <input :value="selected_ambiente.codigo" type="text" class="form-control" id="ambcodigo" disabled>
            </div>

            <div class="mb-3">
                <label for="ambnome" class="form-label">Ambiente</label>
                <input :value="selected_ambiente.nome" type="text" class="form-control" id="ambnome" disabled>
            </div>

            <div class="mb-3">
                <label for="ambtipo" class="form-label">Tipo</label>
                <input id="ambtipo" type="text" value="Físico" class="form-control" disabled>
            </div>

            <div class="mb-3">
                <label for="amblider" class="form-label">Líder</label>
                <input id="amblider" type="text" v-model="selected_ambiente.lider" class="form-control"
                    :class="{ 'border-danger': !new_leader.valido }" list="lista_usuarios">
            </div>

        </template>

    </Modal>

    <table class="table">
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Concluído</th>
                <th class="text-center">Líder</th>
                <th># items</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="5"><input v-model="pesquisa" placeholder="Digite para pesquisar" class="form-control">
                </td>
            </tr>
            <tr v-for="amb in  ambientes_filtrados ">
                <td>{{ amb.codigo }}</td>
                <td>{{ amb.nome }}</td>
                <td>{{ amb.tipo ? amb.tipo : "Físico" }}</td>
                <td>
                    <template v-if="ambientes.status[amb.codigo]">
                        <ProgressBar :atual=" ambientes.status[amb.codigo].volumados "
                            :maximo=" ambientes.status[amb.codigo].todos " :percentual=" ambientes.status[amb.codigo].percent"
                            :key="amb.codigo"
                            >
                        </ProgressBar>
                    </template>
                </td>
                <td class="text-center">
                    <template v-if=" amb.lider ">{{ amb.lider.nome }}</template>
                    <template v-else>
                        <button class="btn btn-primary btn-sm" data-bs-target="#adicionaLider" data-bs-toggle="modal"
                            title="Adicionar líder" @click=" () => selected_ambiente_key = amb.codigo "><i
                                class="bi bi-plus"></i></button>
                    </template>
                </td>
                <td>{{ amb.items }}</td>
            </tr>
        </tbody>
    </table>
</template>