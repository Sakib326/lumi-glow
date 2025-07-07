import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./modules/@common/@layout/public/header";
import Login from "./components/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Google Login Route */}
        <Route path="/login" element={<Login />} />

        {/* After login, show header via UserMenu */}
        <Route path="/home" element={<Header />} />
      </Routes>
    </BrowserRouter>
  );
}
