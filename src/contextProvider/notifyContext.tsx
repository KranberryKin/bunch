import React, { createContext, useContext, useEffect, useState } from "react";
import Notify from "../components/notify/notify.tsx";

enum Statis {
none
}

interface INotify {
    statis: Statis;
    message: string;
    time_stamp: number;
    timeout_stamp:number;
}

const NotifyContext = createContext({ sendNotify: (str: string) => {} });

export const NotifyProvider = ({Children}) => {
    const [notifys, setNotifys] = useState<INotify[]>([]);
    const [checking, setChecking] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            checkNotifys();
        }, 5000)
    },[notifys])

    const createNotify = (stat:Statis, message:string):INotify => {
        return({
            statis: stat,
            message,
            time_stamp: Date.now(),
            timeout_stamp: 5000
        })
    }

    const checkNotifys = () => {
        console.log("notifys", notifys)

        if(!checking){
            setChecking(true);
            let notifyToKeep: INotify[] = [];
            const time = Date.now()
            if(notifys.length > 0){
                for(let i = 0; i < notifys.length; i++){
                    const notifyInCheck = notifys[i];
                    const isSessionValid = time - notifyInCheck.time_stamp <= notifyInCheck.timeout_stamp;
                    if(isSessionValid){
                        notifyToKeep.push(notifyInCheck)
                    }
                }
                setNotifys(notifyToKeep);
            }
            setChecking(false);
        }
    }
    const sendNotify = (str:string) => {
        const newNotifys = [...notifys ]
        newNotifys.push(createNotify(Statis.none, str))
        setNotifys(newNotifys);
    }

    return(<NotifyContext.Provider value={{sendNotify}}>
        <div className="notify">
        {notifys.length === 0 ? null : notifys.map((notify) => {
            return(<Notify message={notify.message}/>)
        })}

        </div>
    {Children}
    </NotifyContext.Provider>)
}

export const useNotify = () => useContext(NotifyContext);