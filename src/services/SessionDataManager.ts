interface ISessionData {
    value: object,
    timestamp: number,
    expiry: number // Convert minutes to milliseconds
}

class SessionDataManager<T> {
    private _key;
    constructor(key:string) {
        this._key = key;
    }

    saveSessionData( value: object, expiryInMinutes: number): void {
        const sessionData: ISessionData = {
          value,
          timestamp: Date.now(),
          expiry: expiryInMinutes * 60 * 1000, // Convert minutes to milliseconds
        };
        window.localStorage.setItem(this._key, JSON.stringify(sessionData));
      }

      checkSessionData<T>(): T | null {
        const sessionItem = window.localStorage.getItem(this._key);
        if (!sessionItem) return null;
      
        try {
          const sessionData = JSON.parse(sessionItem) as {
            value: T;
            timestamp: number;
            expiry: number;
          };
      
          const currentTime = Date.now();
          const isSessionValid = currentTime - sessionData.timestamp <= sessionData.expiry;
      
          if (!isSessionValid) {
            window.localStorage.removeItem(this._key); // Remove expired session
            return null;
          }
      
          return sessionData.value; // Return valid session data
        } catch (error) {
          console.error('Error parsing session data:', error);
          return null;
        }
      }

      clearSession() {
        const sessionItem = window.localStorage.getItem(this._key);
        if(sessionItem !== null){
          window.localStorage.removeItem(this._key);
        }
      }
} 

export default SessionDataManager;