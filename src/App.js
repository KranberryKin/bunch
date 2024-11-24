import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './pages/homepage/HomePage'

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
