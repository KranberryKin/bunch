import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import HomePage from './pages/homepage/HomePage.tsx'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/bunch' element={
            <>
            <Header />
            <HomePage />
            <Footer />
            </>
            }/>
          <Route path='/my_profile' element={
            <>
              <Header />
              <div className='body-content'>Hello World Profile Page</div>
              <Footer />
            </>
            }/>
            <Route  />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
