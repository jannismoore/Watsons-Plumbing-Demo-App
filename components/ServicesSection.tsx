import React from 'react';
import { Wrench, Building2, Droplets, ShieldCheck, Gauge, Flame } from 'lucide-react';

const services = [
  {
    title: "Residential Plumbing",
    desc: "Complete repair, installation, and maintenance for your home. From leaks to renovations.",
    icon: <Wrench className="w-8 h-8 text-watson-blue" />
  },
  {
    title: "Commercial Plumbing",
    desc: "Scalable solutions for businesses in NYC. New construction, grease traps, and large-scale systems.",
    icon: <Building2 className="w-8 h-8 text-watson-blue" />
  },
  {
    title: "Boiler & Heating",
    desc: "Installation and repair of heating systems to keep you warm during New York winters.",
    icon: <Flame className="w-8 h-8 text-watson-blue" />
  },
  {
    title: "Local Law 152",
    desc: "Certified gas piping inspections to ensure your building meets NYC safety regulations.",
    icon: <ShieldCheck className="w-8 h-8 text-watson-blue" />
  },
  {
    title: "Backflow Prevention",
    desc: "Protecting your water supply from contamination with certified prevention systems.",
    icon: <Droplets className="w-8 h-8 text-watson-blue" />
  },
  {
    title: "Pump Services",
    desc: "Sump pumps, booster pumps, and ejector pumps installation and maintenance.",
    icon: <Gauge className="w-8 h-8 text-watson-blue" />
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Our Professional Services
          </h2>
          <p className="text-gray-600 text-lg">
            Your complete source for all residential and commercial plumbing and heating needs. We prioritize cleanliness, efficiency, and fair pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
              <div className="mb-6 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-watson-blue group-hover:text-white transition-colors duration-300">
                {React.cloneElement(s.icon as React.ReactElement<any>, { className: `w-8 h-8 ${'text-current'}` })}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;