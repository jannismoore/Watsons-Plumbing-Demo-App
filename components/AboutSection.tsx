import React from 'react';
import { CheckCircle2, Clock, Shield } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2 relative">
            <img 
                src="https://picsum.photos/800/600" 
                alt="Plumber working" 
                className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-6 -right-6 bg-watson-blue text-white p-8 rounded-xl shadow-xl hidden md:block">
                <div className="text-4xl font-bold mb-1">20+</div>
                <div className="text-sm uppercase tracking-wider">Years Experience</div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Why Choose Watson's Plumbing?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Since 1996, we have been serving the plumbing needs of customers in Manhattan and the Bronx. We are a local, trusted, and service-oriented business dedicated to fixing your problems right the first time.
            </p>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-watson-red shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-800">Prompt & Efficient</h4>
                  <p className="text-sm text-gray-600">We respect your time. Same morning service often available.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-watson-red shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-800">Guaranteed Satisfaction</h4>
                  <p className="text-sm text-gray-600">Unparalleled craftsmanship and total customer satisfaction on every job.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-watson-red shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-800">Professional Plumbers</h4>
                  <p className="text-sm text-gray-600">Trained professionals with the proper tools to diagnose issues correctly.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;