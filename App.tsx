import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ServicesSection />
        
        {/* Reviews Snippet (Inline for simplicity in file structure) */}
        <section id="reviews" className="py-20 bg-watson-blue text-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-12">What Our Neighbors Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { text: "Arrived earlier than promised and fixed the leak immediately. Professional and clean.", loc: "Manhattan, NY", stars: 5 },
                        { text: "Diagnosed a heating issue that three other plumbers missed. Truly experienced.", loc: "Bronx, NY", stars: 5 },
                        { text: "Fair pricing and polite service. My go-to for all building maintenance.", loc: "Harlem, NY", stars: 5 }
                    ].map((r, i) => (
                        <div key={i} className="bg-blue-800 p-6 rounded-lg">
                            <div className="flex justify-center mb-4 text-yellow-400">
                                {[...Array(r.stars)].map((_,j) => <span key={j}>★</span>)}
                            </div>
                            <p className="italic mb-4">"{r.text}"</p>
                            <p className="text-sm font-bold opacity-75">- Customer in {r.loc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;