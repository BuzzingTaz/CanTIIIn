import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import 'antd/dist/antd.dark.css';
import './App.css';

import Navbar from "./components/templates/navbar"
import Title from "./components/pages/title"
import LoginForm from "./components/pages/login"
import RegisterForm from "./components/pages/register"
import Profile from "./components/pages/profile"
import Dashboard from "./components/pages/dashboard"
import Orders from "./components/pages/orders"
import Stats from "./components/pages/stats"

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Title />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/stats" element={ <Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
