import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex justify-between">
          <Link to="/" className="text-xl font-bold">
            LumiGlow
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link to="/checkout" className="hover:text-blue-600">
              Cart
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;