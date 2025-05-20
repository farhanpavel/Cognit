import React from "react";
import {
  FileText,
  ShoppingCart,
  TrendingUp,
  Box,
  Crown,
  GraduationCap,
} from "lucide-react";

export default function Feature() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Landing pages",
      description:
        "Build landing pages and sales pages with no-code drag and drop builder. Gets you more conversions for your offers.",
    },
    {
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      title: "Sales funnels",
      description:
        "Maximise revenue from every visitor with carefully crafted sales funnels. Create and manage with our visual funnel canvas.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Checkouts & Order",
      description:
        "Take payments on your own website with beautiful, highly customizable checkout page designs, including order bumps.",
    },
    {
      icon: <Box className="h-6 w-6 text-white" />,
      title: "Upsells & Downsells",
      description:
        "Increase average order values with intelligent upsells and downsell sales flows, and track conversions with funnels.",
    },
    {
      icon: <Crown className="h-6 w-6 text-white" />,
      title: "Theme Builder",
      description:
        "Get free SEO traffic to your offers with high impact blogs - this builds a sustainable flywheel in your business.",
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      title: "Online Courses",
      description:
        "Grow recurring revenue with online courses and sites. Fully customizable to match your brand and website.",
    },
  ];

  return (
    <section className="py-16 font-mona">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-tertiary">
            Much more than{" "}
            <span className="text-[#7657ff]/80">just a page builder...</span>
          </h2>
          <p className="text-[#5a5a5a] text-sm font-medium w-[50%] mx-auto text-center mt-3">
            With the OptimizeSuite, you get a complete suite of tools that
            empower you to market your products and services the way they
            deserve
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl p-6  flex items-start gap-4">
              <div className="bg-tertiary text-white p-3 rounded-lg shadow-xl shadow-white">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-occean">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
