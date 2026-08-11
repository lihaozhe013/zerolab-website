import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import TeleopPage from '@/pages/TeleopPage';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<HomePage />} />
          <Route path="product" element={<HomePage />} />
          <Route path="solution" element={<HomePage />} />
          <Route path="application" element={<HomePage />} />
          <Route path="contact" element={<HomePage />} />
          <Route path="teleop" element={<TeleopPage />} />
          <Route path="downloads" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
