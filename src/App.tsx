import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import ApplicationPage from '@/pages/ApplicationPage';
import DownloadsPage from '@/pages/DownloadsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

function ProductLoading() {
  const { t } = useTranslation();
  return (
    <div className="product-route-loading" role="status">
      {t('product_detail.loading')}
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductPage />} />
          <Route
            path="product/:slug"
            element={
              <Suspense fallback={<ProductLoading />}>
                <ProductDetailPage />
              </Suspense>
            }
          />
          <Route path="application" element={<ApplicationPage />} />
          <Route path="solution" element={<Navigate to="/product" replace />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="teleop"
            element={<Navigate to="/product/openarm-z" replace />}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
