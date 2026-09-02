import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import ApplicationPage from '@/pages/ApplicationPage';
import SolutionPage from '@/pages/SolutionPage';
import DownloadsPage from '@/pages/DownloadsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import TeleopPage from '@/pages/TeleopPage';

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="application" element={<ApplicationPage />} />
          <Route path="solution" element={<SolutionPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="teleop" element={<TeleopPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
