import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewReleases from './pages/NewReleases';
import Brands from './pages/Brands';
import Compare from './pages/Compare';
import Social from './pages/Social';
import About from './pages/About';
import BrandDetail from './pages/BrandDetail';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-releases" element={<NewReleases />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brand/:id" element={<BrandDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/social" element={<Social />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;