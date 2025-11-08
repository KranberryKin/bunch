import React from 'react'
import './bunchApp.css'
import NavBar from '../../components/side-navbar/navBar.tsx'
import { useNotify } from '../../contextProvider/notifyContext.tsx'
import { Route, Routes } from 'react-router-dom'

const BunchApp = ({childern}: {childern:any}) => {
 const {sendNotify} = useNotify();
  
    return <div className='bunchApp-container'>
        <NavBar />
        <div className='bunchApp-page-container'>
            {childern ? childern : null}
            
        </div>
    </div>
}

export default BunchApp;