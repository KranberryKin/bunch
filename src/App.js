import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={
            <>
              <Header />
              <div className='body-content'>Hello World Home Page</div>
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
