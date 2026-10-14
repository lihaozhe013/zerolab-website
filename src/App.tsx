import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import ApplicationPage from '@/pages/ApplicationPage';
import DownloadsPage from '@/pages/DownloadsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="application" element={<ApplicationPage />} />
          <Route path="solution" element={<Navigate to="/product" replace />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="teleop"
            element={
              <Navigate
                to={{ pathname: '/product', hash: '#openarm-z' }}
                replace
              />
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
