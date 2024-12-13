import React, { ReactNode } from 'react'
import './bunchApp.css'
import NavBar from '../../components/side-navbar/navBar.tsx'
import { Route, Routes } from 'react-router-dom'
//Goals :
// ⏹️ I want a NavBar on the side for each page of the bunchApp
// ⏹️ I want the NavBar to have a button that will hide/reveal the side NavBar

const BunchApp = ({childComponent}:{childComponent: React.JSX.Element}) => {
    return <div className='bunchApp-container'>
        <NavBar />
        <div className='bunchApp-page-container'>
           {childComponent}
        </div>
    </div>
}

export default BunchApp;