<script setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const itemModel = reactive({
    key: "",
    descricao: "",
    short_descricao: "",
    ambiente: "",
    medidas: null,
    peso: null,
    fragil: false,
    transporte_especial: false,
    inteiro: true,
    observacoes: "",
    volume: null,
})
</script>
<template>
    <div class="row">
        <div class="col">
            <h1>Adicionar item</h1>
            <p>Items adicionados aqui são items que não tem número de patrimônio, mas que você quer
                manter o controle durante o processo de mudança.</p>
            <form>
                <div class="row mb-2 justify-items-start">
                    <label for="ambiente" class="col-lg-1 col-sm-2 col-form-label">Ambiente</label>
                    <div class="col-auto col-lg-8">
                        <input type="text" class="form-control" id="ambiente" v-model="itemModel.ambiente">
                    </div>
                </div>

                <div class="row mb-2 justify-items-start">
                    <label for="descricao" class="col-lg-1 col-sm-2 col-form-label">Descrição</label>
                    <div class="col-auto col-lg-8">
                        <input type="text" class="form-control" id="descricao" v-model="itemModel.descricao">
                    </div>
                </div>

                <div class="row mb-2 justify-items-start">
                    <label for="medidas" class="col-lg-1 col-sm-2 col-form-label ">Medidas</label>
                    <div class="col-auto col-lg-8">
                        <input type="text" class="form-control" id="medidas" v-model="itemModel.medidas">
                    </div>
                </div>

                <div class="row mb-2 justify-items-start">
                    <label for="peso" class="col-lg-1 col-sm-2 col-form-label ">Peso</label>
                    <div class="col-auto col-lg-8">
                        <input type="text" class="form-control" id="peso" v-model="itemModel.peso">
                    </div>
                </div>
                <div class="row mb-2 justify-items-start">
                    <div class="col-auto col-lg-8">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="fragil" v-model="itemModel.fragil">
                            <label class="form-check-label" for="fragil">Frágil</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="especial"
                                v-model="itemModel.transporte_especial">
                            <label class="form-check-label" for="especial">Transporte especial</label>
                        </div>
                    </div>
                </div>

                <div class="row mb-2 justify-items-start">
                    <label for="observacoes" class="col-lg-1 col-sm-2 col-form-label ">Observações</label>
                    <div class="col-auto col-lg-8">
                        <input type="text" class="form-control" id="observacoes" v-model="itemModel.observacoes">
                    </div>
                </div>

                <div class="row mb-2 justify-items-end">
                    <div class="col-7 col-lg-8"></div>
                    <div class="col-auto">
                        <button class="btn btn-primary">
                            Salvar
                            </button>
                    </div>
                    </div>
            </form>
        </div>
    </div>
</template>