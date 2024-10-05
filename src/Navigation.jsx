import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';

const Navigation = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/solar-system" element={<div>Solar System Page</div>} />
                <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                {/* Agrega más rutas según sea necesario */}
            </Routes>
        </Router>
    );
};

export default Navigation;
