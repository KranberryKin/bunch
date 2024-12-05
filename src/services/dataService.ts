class LocalStorageManager<T extends {id:number}> {
    private _key:string;
    public values: T[];

    constructor(key:string){
        this._key = key
        this.values = this.get() || [] as T[];
    }

    private saveState() {
        window.localStorage.setItem(this._key, JSON.stringify(this.values));
    }
    
    add(obj: T): void {
        try {
            this.values.push(obj);
            this.saveState();
            this.get()
        } catch (error) {
          console.error(`Error adding item in localStorage with key "${this._key}":`, error);
        }
      }

    get(): T[] | null {
        try {
          const items = window.localStorage.getItem(this._key);
          if(items !== null){
            const parsedItems = JSON.parse(items) as T[];
            this.values = parsedItems;
            return parsedItems;
          }else{
            return [] as T[]
          }
        } catch (error) {
          console.error(`Error getting item from localStorage with key "${this._key}":`, error);
          return null;
        }
      }

    getDataById(id:number) {
        try {
            const objIndex = this.values.findIndex(obj => obj?.id == id)
            if(objIndex > -1){
                return this.values[objIndex];
            }else{
                throw new Error("Data Not Found By Id '${id}'");
            }
        } catch (error){
            console.error(`Error getting item from localStorage with key "${this._key}":`, error);
            return null;
        }
    };

    updateData(obj:T) {
        try {
            const objToUpdate = this.values.find(vObj => vObj.id === obj.id);
            const keys = Object.keys(obj);
            if(objToUpdate !== undefined){
                for(let i = 0; i < keys.length; i++){
                    const key = keys[i];
                    objToUpdate[key] = obj[key];
                }
                const removeObjIndex =  this.values.findIndex(vObj => vObj.id === obj.id);
                if(removeObjIndex > -1){
                    this.values.splice(removeObjIndex, 1);
                    this.values.push(objToUpdate);
                    this.saveState();
                }else {
                throw new Error(`Can't find Obj w/ id "${obj.id}" `)
                }
            } else {
                throw new Error(`Can't find Obj w/ id "${obj.id}" `)
            }
        } catch (error) {
            console.error(`Error update item to localStorage with key "${this._key}":`, error);
            return;
        }
    };

    deleteData(obj:T) {
        try {
            const delObjIndex = this.values.findIndex(valObj => valObj.id === obj.id);
            if(delObjIndex > -1){
                this.values.filter(valObj => valObj.id !== obj.id);
                this.saveState()
            }else {
                throw new Error(`Can't find Obj w/ Id "${obj.id}"`)
            }
        }catch (error) {
            console.error(`Error deleting item from localStorage with key "${this._key}":`, error);
            return;
        }
    };
}