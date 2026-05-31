import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Wealth from './Wealth';

function App() {
  return (
    <Routes>
      {/* หน้าพอร์ตโฟลิโอเดิม */}
      <Route path="/" element={<Home />} />
      {/* หน้า Private Banking สำหรับสัมภาษณ์ */}
      <Route path="/wealth" element={<Wealth />} />
    </Routes>
  );
}

export default App;