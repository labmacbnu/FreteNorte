

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
    origem: array[string] // strings que são `ambientes.ambiente_codigo`
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