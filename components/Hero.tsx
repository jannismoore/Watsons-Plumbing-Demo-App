import React from 'react';
import VoiceDemo from './VoiceDemo';
import { VoiceMode } from '../types';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://picsum.photos/1600/900?grayscale&blur=2" 
            alt="Plumbing background" 
            className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-watson-blue via-watson-blue/90 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="lg:w-1/2 text-white space-y-6">
            <div className="inline-block bg-watson-red px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                Top Rated Local® Service
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Residential & Commercial Plumbing Experts
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg">
              Serving Manhattan and the Bronx for over 20 years. We guarantee to fix it right the first time with unparalleled craftsmanship and dependability.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
                <a href="#contact" className="bg-watson-red hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg">
                    Book Service Now
                </a>
                <div className="flex items-center gap-2 text-gray-300 px-4 py-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Available 24/7 for Emergencies
                </div>
            </div>
          </div>

          {/* Voice AI Demo Container */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Experience Our AI Support</h3>
                    <p className="text-blue-200 text-sm">Try speaking with our automated dispatch agents below.</p>
                </div>
                <VoiceDemo initialMode={VoiceMode.RECEPTION} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;