"use client";

import {
  ArrowRight,
  LayoutGrid,
  MonitorSmartphone,
  LineChart,
  Palette,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function Feature() {
  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    [
      {
        icon: <LayoutGrid className="w-8 h-8" />,
        title: "Interaction Design",
        description:
          "Lessons on design that cover the most recent developments.",
        color: "bg-emerald-400",
        textColor: "text-white",
        iconColor: "text-white",
      },
      {
        icon: <MonitorSmartphone className="w-8 h-8" />,
        title: "UX Design Course",
        description:
          "Classes in development that cover the most recent advancements in web.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-blue-400",
      },
      {
        icon: <LineChart className="w-8 h-8" />,
        title: "User Interface Design",
        description:
          "User Interface Design courses that cover the most recent trends",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-pink-400",
      },
    ],
    [
      {
        icon: <Palette className="w-8 h-8" />,
        title: "Visual Design",
        description: "Learn the principles of visual design and color theory.",
        color: "bg-emerald-400",
        textColor: "text-white",
        iconColor: "text-white",
      },
      {
        icon: <MonitorSmartphone className="w-8 h-8" />,
        title: "Mobile App Design",
        description: "Create intuitive and engaging mobile app experiences.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-blue-400",
      },
      {
        icon: <LineChart className="w-8 h-8" />,
        title: "Data Visualization",
        description:
          "Learn to present complex data in intuitive visual formats.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-pink-400",
      },
    ],
    [
      {
        icon: <LayoutGrid className="w-8 h-8" />,
        title: "Design Systems",
        description:
          "Build scalable and consistent design systems for products.",
        color: "bg-emerald-400",
        textColor: "text-white",
        iconColor: "text-white",
      },
      {
        icon: <MonitorSmartphone className="w-8 h-8" />,
        title: "Responsive Design",
        description:
          "Create websites that work beautifully across all devices.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-blue-400",
      },
      {
        icon: <LineChart className="w-8 h-8" />,
        title: "Design Thinking",
        description:
          "Apply design thinking methodology to solve complex problems.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-pink-400",
      },
    ],
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  }, [features.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  }, [features.length]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-tertiary font-medium mb-2  ">Our Services</p>
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
          Fostering a playful & <span className="text-tertiary">engaging</span>{" "}
          learning environment
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {features.map((slideFeatures, slideIndex) => (
            <div
              key={slideIndex}
              className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {slideFeatures.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className={`${feature.color} rounded-lg p-6 ${feature.textColor} shadow-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className={`mb-4 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p
                    className={`${
                      feature.color === "bg-white" ? "text-gray-600" : ""
                    } mb-4`}
                  >
                    {feature.description}
                  </p>
                  <a
                    href="#"
                    className={`inline-flex items-center font-medium ${
                      feature.color === "bg-white" ? "text-emerald-500" : ""
                    } group`}
                  >
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              activeSlide === index
                ? "w-8 h-2 bg-emerald-400"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
