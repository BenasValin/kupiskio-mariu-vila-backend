import { Link } from "react-router-dom";
import italyFlag from "../assets/images/illustration-italy-flag_53876-27098.avif";
import cartIcon from "../assets/images/cart.png";
import { useContext, useState, useEffect } from "react";
import { CartSizeContext } from "@/contexts/cartSizeContext";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartSize } = useContext(CartSizeContext);

  // Track scroll position for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={italyFlag}
                className="h-10 w-auto"
                alt="Italian Restaurant Logo"
              />
              <span className="ml-2 font-bold text-gray-800 hidden sm:block">
                Italijos Skonis
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-amber-500 font-medium transition duration-150"
            >
              Apie mus
            </Link>
            <Link
              to="/shop"
              className="text-gray-700 hover:text-amber-500 font-medium transition duration-150"
            >
              Parduotuvė
            </Link>
            <Link
              to="/recipes"
              className="text-gray-700 hover:text-amber-500 font-medium transition duration-150"
            >
              Receptai
            </Link>
            <Link
              to="/contacts"
              className="text-gray-700 hover:text-amber-500 font-medium transition duration-150"
            >
              Kontaktai
            </Link>
          </div>

          {/* Right Side - Cart & Shop Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-500 transition duration-150"
            >
              <img src={cartIcon} className="h-6 w-auto" alt="Shopping Cart" />
              {/* {cartSize > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartSize}
                </span>
              )} */}
            </Link>

            <Link to="/shop">
              <button className="bg-amber-400 hover:bg-amber-500 text-white font-medium py-2 px-4 rounded-full transition duration-150 shadow-sm">
                Parduotuvė
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden bg-gray-100 p-2 rounded-md text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Apie mus
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Parduotuvė
            </Link>
            <Link
              to="/recipes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Receptai
            </Link>
            <Link
              to="/contacts"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontaktai
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
