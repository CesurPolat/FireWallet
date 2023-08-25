template = {
    "wallet": [],
    //TODO: ?
    "accountCreated":[],
}


function reset(){
    const store = global.store.store;
    Object.keys(template).forEach((key)=>{
        if(!store.has(key)){
            store.set(key,template[key])
        }
    })
    
}

exports.reset = reset