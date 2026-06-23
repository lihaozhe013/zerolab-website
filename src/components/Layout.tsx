import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent={isHome} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
