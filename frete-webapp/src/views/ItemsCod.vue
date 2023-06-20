<script setup>
import { useRoute } from 'vue-router';
import { getFirestore, getDoc, collection, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { onBeforeMount, reactive } from 'vue';
import { useSingleItemStore } from '../stores/singleitem'


const db = getFirestore(firebaseApp)


const route = useRoute()
const codigo = route.params.codigo

const item = useSingleItemStore()

onBeforeMount( async () =>  item.get_item(codigo) )

</script>

<template> 
<h4>{{item.dados.short_descricao}}</h4>
 <p>{{item.dados.descricao}}</p>        
 <p> Edificio: {{ item.dados.edificio }}</p>
 <p> Ambiente: {{ item.dados.ambiente }}</p>
 <p> Patrimônio {{ item.dados.patrimonio }}</p>
 <p> Valor: R$ {{ item.dados.valor }}</p>
</template>