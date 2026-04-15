import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Tracker from './pages/Tracker';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-grow flex flex-col w-full items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/tracker/:orderId?" element={<Tracker />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
          </Routes>
        </main>
        <CartDrawer />
      </div>
    </Router>
  );
}

export default App;
