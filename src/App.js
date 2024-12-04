import './App.css';
import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import Body from './components/body/Body.tsx'
import { useState } from 'react';
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  return (
    <div className="App">
      <Router>
        <Header currentUser={currentUser}/>
        <Body currentUser={currentUser} setCurrentUser={setCurrentUser}/>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
