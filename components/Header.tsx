import React, { useState } from 'react';
import { Menu, X, Phone, Hammer, Thermometer } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-watson-blue text-white py-2 px-4 md:px-8 text-sm flex justify-between items-center">
        <div className="hidden md:block">Serving Manhattan & The Bronx Since 1996</div>
        <div className="flex items-center gap-2 font-bold">
          <span>Have An Issue? Call Us Now:</span>
          <a href="tel:2123683434" className="hover:text-watson-accent transition-colors">(212) 368-3434</a>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center space-x-3">
            <div className="bg-watson-blue p-2 rounded text-white">
                <Hammer className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-watson-blue leading-tight">
                    Watson's Plumbing
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block tracking-widest uppercase">Heating & Building Services</p>
            </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a 
                key={link.name} 
                href={link.href} 
                className="text-gray-700 font-semibold hover:text-watson-red transition-colors uppercase text-sm tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 absolute w-full">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-gray-800 font-medium py-2 border-b border-gray-200 last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;