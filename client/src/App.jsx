import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PracticeAreas from './pages/PracticeAreas';
import Team from './pages/Team';
import Insights from './pages/Insights';
import Contact from './pages/Contact';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice-areas" element={<PracticeAreas />} />
        <Route path="/team" element={<Team />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}
