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
        title: "Interactive Simulations",
        description:
          "Bring core science concepts to life with touch-friendly, localized, and low-bandwidth simulations — designed for both urban and rural learners.",
        color: "bg-emerald-400",
        textColor: "text-white",
        iconColor: "text-white",
      },
      {
        icon: <MonitorSmartphone className="w-8 h-8" />,
        title: "Voice-First Navigation",
        description:
          "Navigate the app completely hands-free. Optimized for learners with disabilities or literacy challenges — available in Bangla and local dialects.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-blue-400",
      },
      {
        icon: <LineChart className="w-8 h-8" />,
        title: "Student-Led Research",
        description:
          "Empower students to collect and contribute real data — from biodiversity logs to air quality — and join live citizen science missions.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-pink-400",
      },
    ],
    [
      {
        icon: <Palette className="w-8 h-8" />,
        title: "Offline-First Learning",
        description:
          "Access science modules, simulations, and quizzes even without internet. Perfect for students in low-connectivity zones.",
        color: "bg-emerald-400",
        textColor: "text-white",
        iconColor: "text-white",
      },
      {
        icon: <MonitorSmartphone className="w-8 h-8" />,
        title: "Science in Your Language",
        description:
          "Break the language barrier. Learn science in clear Bangla, regional dialects, or audio-visual formats — no reading required.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-blue-400",
      },
      {
        icon: <LineChart className="w-8 h-8" />,
        title: "Critical Thinking Tools",
        description:
          "Learn how to spot fake science. Built-in modules teach students how to validate information, analyze claims, and think like scientists.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-pink-400",
      },
    ],
    [
      {
        icon: <LayoutGrid className="w-8 h-8" />,
        title: "Gamified Quizzes & Badges",
        description:
          "Make learning addictive. Earn badges, level up, and compete with friends in science quizzes that adapt to your pace.",
        color: "bg-emerald-400",
        textColor: "text-white",
        iconColor: "text-white",
      },
      {
        icon: <MonitorSmartphone className="w-8 h-8" />,
        title: "Push Notifications for Learning",
        description:
          "Get timely nudges for new modules, research opportunities, and science days — keeping students curious and consistent.",
        color: "bg-white",
        textColor: "text-gray-800",
        iconColor: "text-blue-400",
      },
      {
        icon: <LineChart className="w-8 h-8" />,
        title: "Inclusive by Design",
        description:
          "Built with WCAG accessibility standards. Supports screen readers, voice control, large type, and low-vision contrast modes.",
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
        <p className="text-tertiary font-medium mb-2  ">Our Goal</p>
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
          Making science accessible, visual, and{" "}
          <span className="text-tertiary">fun</span> for every learner
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
