import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProductPage from '@/pages/ProductPage';
import SolutionPage from '@/pages/SolutionPage';
import ApplicationPage from '@/pages/ApplicationPage';
import ContactPage from '@/pages/ContactPage';
import TeleopPage from '@/pages/TeleopPage';
import DownloadsPage from '@/pages/DownloadsPage';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="solution" element={<SolutionPage />} />
          <Route path="application" element={<ApplicationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="teleop" element={<TeleopPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
