import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      {/* Header appears on ALL pages */}
      <Header />

      {/* Only one page renders at a time based on URL */}
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 404 - must be LAST */}
        <Route path="*"          element={<NotFound />} />
      </Routes>

      {/* Footer appears on ALL pages */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;