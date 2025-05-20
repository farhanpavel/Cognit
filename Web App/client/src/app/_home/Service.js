import React from "react";
import { Star } from "lucide-react";

export default function Service() {
  const testimonials = [
    {
      quote:
        '"It\'s easier than ever with Optimize Press 3.0...if a 72 year old can do this - you can."',
      author: "Paul Clegg, UK",
      stars: 5,
    },
    {
      quote:
        '"...we can quickly build new pages to test out new layouts or features without too much work."',
      author: "Paul Clegg, UK",
      stars: 5,
    },
    {
      quote:
        '"Have been using it for 5 years and don\'t ever see myself switching"',
      author: "Paul Clegg, UK",
      stars: 5,
    },
    {
      quote:
        '"It\'s easier than ever with Optimize Press 3.0...if a 72 year old can do this - you can."',
      author: "Paul Clegg, UK",
      stars: 5,
    },
  ];

  return (
    <div className="bg-occean font-mona ">
      <div className="container mx-auto max-w-6xl px-7 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-3xl font-bold text-white ">
            Our Services
          </h2>
          <p className="text-white text-sm font-medium w-[50%] mx-auto text-center mt-3 ">
            We provide comprehensive solutions tailored to your business needs.
            Our team of experts is ready to help you achieve your goals.
          </p>

          {/* Service Cards - You can expand this section as needed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
            <div className="bg-occean/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                Web Development
              </h3>
              <p className="text-white/70">
                Custom websites and applications built with the latest
                technologies.
              </p>
            </div>

            <div className="bg-occean/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                Digital Marketing
              </h3>
              <p className="text-white/70">
                Strategic marketing campaigns to grow your online presence.
              </p>
            </div>

            <div className="bg-occean/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                UI/UX Design
              </h3>
              <p className="text-white/70">
                Beautiful, intuitive designs that enhance user experience.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="mt-12 px-8 py-3 bg-white text-occean font-bold rounded-lg hover:bg-white/90 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}
