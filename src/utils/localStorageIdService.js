


export function LocalStorageIdService (){
    let id = localStorage.getItem('IdService');
    console.log("lcoalID1: ", id)
    id++; 
    console.log("lcoalID2: ", id)

    localStorage.setItem('IdService', id);
    return  id; 
}