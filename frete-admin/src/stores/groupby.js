
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}
 export function orderedGroupBy(list, keyGetter){
        var mapa = groupBy(list, keyGetter);
        var chaves = Array.from(mapa.keys())
        chaves.sort()
        var objeto_organizado = {}
        for(var k of chaves){
            objeto_organizado[k] = mapa.get(k)
        }
        return objeto_organizado 
}
