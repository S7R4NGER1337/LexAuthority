import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <div key={location.pathname} className="page-enter">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
