import './App.css';
import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import Body from './components/body/Body.tsx'
import { useState } from 'react';
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const page_options = [
    {page_name:"Home", page_url: "/bunch"},
    {page_name:"Profile", page_url: "/my_profile"},
    {page_name:"Login", page_url:"/login"},
    {page_name: "BunchApp", page_url: "/bunchApp"}
]
  return (
    <div className="App">
      <Router>
        <Header currentUser={currentUser} page_options={page_options}/>
        <Body currentUser={currentUser} setCurrentUser={setCurrentUser} page_options={page_options}/>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
