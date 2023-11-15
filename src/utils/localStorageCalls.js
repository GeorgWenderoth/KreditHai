


export function LocalStorageCalls(method, storage,object){

    switch (method) {
      case "post":
        localStorage.setItem(storage, JSON.stringify(object))
        break;
      case "get":
       let data = localStorage.getItem(storage)
      return data = data ? JSON.parse(data): [];
        break;
      case "delete":
        localStorage.setItem('punktErledigt', JSON.stringify([]));
        break;
      case "put":
        localStorage.setItem('punkt', JSON.stringify(object));
        break;
    } 
}