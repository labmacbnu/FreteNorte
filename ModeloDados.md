

## Ambientes

```js
/** ambientes */
{
    edificio: string,
    ambiente_codigo: string, // Chave primária
    ambiente_nome: string, 
    items: int,
    status: string,
    lider: referencia[usuarios]
} 
```

## Ambientes-norte

```js
/** ambientes-norte */
{
    codigo: string // chave primária
    nome: string,
    origem: array[string] // strings que são referências para `ambientes.ambiente_codigo`
    detalhes: {
        ala: string,
        construcao: string,
        descricao: string,
        dimensao_m: number,
        nomenclarutra: string,
        pavimento: string,
        setor_responsavel: string,
        sigla: string,
        tipo_de_ambiente: string,
    }
} 
```

## Items

```js
{
    ambiente: referencia[ambientes],
    key: string || int, // chave primária
    responsavel: string,
    short_descricao: string,
    tipo: string, // Permanente | Parte | Consumível
    edificio: string,
    meta: {
        inteiro: bool,
        partes: array[referencia[items]],
        updated: date,
        volumado: bool,
        volume: referencia[volumes]
    },
    detalhes: {
        cod_barras: int,
        conservacao: string,
        descricao: string,
        incorporacao: date,
        medidas: string,
        n_controle: int,
        n_serie: string,
        patrimonio: int,
        peso: string,
        situacao: string,
        transf_local: date, 
        valor: number
    }
}
```

## Volumes

```js
{
    categoria: string,
    codigo: string, // chave primária
    data_criacao: date,
    deleted: bool,
    destino: referencia[ambientes-norte],
    items: array[referencia[items]],
    localicazao_atual: referencia[ambientes],
    observacao: string,
    origem: referencia[ambientes],
    propriededes: array[string],
    responsavel: referencia[usuarios],
    status: string
}
```

## Usuarios

```js
/** e-mail é a chave primária */
{
    nome: string,
    role: string,
    ambientes: array[string], // referencia a `ambientes.ambiente_codigo`
    usuario_de: array[string], // referencia a `ambientes.ambiente_codigo`
}
```

## Carregamentos

```js
/** */
{
    caminhao: referencia[caminhoes],
    data_criacao: date,
    data_saida: date,
    empresa: referencia[empresas],
    id: string, // chave primária
    saida: string, // Bloco A, B ou C
    status: string // agendado, carregando, carregado, descarregando, finalizado
}
```

## Caminhões

```js
{
    capacidade: int,
    empresa: referencia[empresas],
    placa: string
}
```

## Empresas

```js
{
    email: string,
    motoristas: array[string],
    nome: string,
    site: string,
    telefones: array[string]
}
```

## Lotes

```js
{
    carregamento: referencia[carregamentos],
    data_criado: date,
    n_volumes: int,
    nome: string,
    responsavel: referencia[usuario],
    tipo: string // Carregamento, Descarregamento
    volumes: array[referencia[volumes]]
}
```

### Movimentos

Cada movimento feito em um volume é registrado em `movimentos/{volumeid}` quando um lote é criado, utilizando a function `processaLotes`

```js
// movimentos/{volumeid}
{
    carregado: {
        data_hora: date,
        responsavel: referencia[usuario],
        lote: referencia[lotes]
    },
    descarregado:{
        data_hora: date,
        responsavel: referencia[usuario],
        lote: referencia[lotes],
        sala: referencia[ambientes-norte]
    }
}
```

## Especiais

Alguns volumes apresentam características que exigem uma movimentação especializada, seja por serem muito frágeis ou pesados. 
Nesses casos, existe um formulário para cada um desses volumes. O link para cada formulário está em `especiais/{volumeid}`.

```js
// especiais/{volumeid}
{
    link: string
}
```

## Agregados

Uma miscelânea de dados agregados para fácil acesso.

```js
{
    ambientes: {
        codigos: array[string],
        liderados: array[string]
    },
    ambientes_norte:{
        codigos: array[string]
    },
    categorias_volumes:{
        valores: array[string]
    },
    edificios:{
        edificios: array[string]
    },
    items:{
        short_descricoes: array[string]
    },
    volumes:{
        quantidade: int
    },
    volumes_status: { // os valores são níveis de prioridade para exibição
        Criado: 0,
        Desmontado: 2,
        Embalado: 1,
        Loteado: 2,
        Para Desmontagem: 1
    }

}
```