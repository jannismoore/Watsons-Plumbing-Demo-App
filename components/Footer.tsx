import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6">Watson's Plumbing</h3>
            <p className="text-gray-400 text-sm mb-6">
              Serving customers in the Manhattan and Bronx area for over 20 years. Your trusted source for residential and commercial plumbing.
            </p>
            <div className="text-watson-red font-bold text-lg">
              Emergency 24/7 Service
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Our Locations</h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-watson-red shrink-0" />
                <span className="text-sm text-gray-300">
                  855 St. Nicholas Ave.<br />New York, NY 10031
                </span>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-watson-red shrink-0" />
                <span className="text-sm text-gray-300">
                  433 Edgecombe Ave<br />New York, NY 10031
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:2123683434" className="flex gap-3 hover:text-watson-accent transition">
                    <Phone className="w-5 h-5 text-watson-red" />
                    <span>(212) 368-3434</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@watsonsplumbingheating.com" className="flex gap-3 hover:text-watson-accent transition">
                    <Mail className="w-5 h-5 text-watson-red" />
                    <span className="text-sm break-all">info@watsonsplumbingheating.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Business Hours</h3>
            <div className="flex gap-3 mb-2">
                <Clock className="w-5 h-5 text-watson-red" />
                <span className="text-sm text-gray-300">Mon - Sat: 8:00am – 5:00pm</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-8">
              *Emergency services available 24 hours a day.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2020 Watson's Plumbing, Heating & Building Services. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest">Serving Manhattan & Bronx Since 1996</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;