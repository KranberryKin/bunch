import React from 'react'
import './bunchApp.css'
import NavBar from '../../components/side-navbar/navBar.tsx'
import { useNotify } from '../../contextProvider/notifyContext.tsx'
//Goals :
// ⏹️ I want a NavBar on the side for each page of the bunchApp
// ⏹️ I want the NavBar to have a button that will hide/reveal the side NavBar

const BunchApp = () => {
 const {sendNotify} = useNotify();
  
    return <div className='bunchApp-container'>
        <NavBar />
        <div className='bunchApp-page-container'>
            <div>
                <button onClick={() => sendNotify("info")}>info</button>
                <button onClick={() => sendNotify("warn")}>warn</button>
                <button onClick={() => sendNotify("Error")}>error</button>
                <button onClick={() => sendNotify("Success")}>Success</button>
            </div>
        </div>
    </div>
}

export default BunchApp;