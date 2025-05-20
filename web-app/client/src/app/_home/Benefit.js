import React from "react";
import {
  CheckCircle,
  Award,
  Zap,
  Shield,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Benefit() {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-tertiary" />,
      title: "Increased Productivity",
      description:
        "Our tools automate repetitive tasks, allowing your team to focus on what truly matters. Users report saving up to 15 hours per week.",
    },
    {
      icon: <Shield className="h-8 w-8 text-tertiary" />,
      title: "Enhanced Security",
      description:
        "Enterprise-grade security protocols protect your data at every level. We maintain strict compliance with industry standards.",
    },
    {
      icon: <Clock className="h-8 w-8 text-tertiary" />,
      title: "Time Efficiency",
      description:
        "Streamlined workflows and intuitive interfaces reduce learning curves and help your team accomplish more in less time.",
    },
    {
      icon: <Users className="h-8 w-8 text-tertiary" />,
      title: "Better Collaboration",
      description:
        "Real-time collaboration features enable seamless teamwork regardless of physical location or time zone differences.",
    },
    {
      icon: <Award className="h-8 w-8 text-tertiary" />,
      title: "Quality Results",
      description:
        "Our intelligent systems help eliminate human error and ensure consistent, high-quality outputs for all your projects.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-tertiary" />,
      title: "Cost Reduction",
      description:
        "By optimizing resources and reducing waste, our platform helps businesses save an average of 30% on operational costs.",
    },
  ];

  return (
    <div className="min-h-screen font-mona">
      <div className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">93%</p>
              <p className="text-gray-600">Customer satisfaction rate</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">30%</p>
              <p className="text-gray-600">Average cost reduction</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">15+</p>
              <p className="text-gray-600">Hours saved per week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Benefits Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-tertiary">Our Platform</span>
            </h2>
            <p className="text-[#5a5a5a] text-sm font-medium w-[50%] mx-auto text-center mt-3 ">
              Our comprehensive solution provides numerous advantages that help
              your business thrive in today&apos;s competitive landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="bg-tertiary/10 p-3 inline-block rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-tertiary/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-tertiary/20 relative">
            <div className="absolute -top-5 left-10 bg-tertiary text-white text-xl font-bold py-2 px-6 rounded-full">
              Success Story
            </div>
            <div className="md:flex items-center gap-8">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-tertiary/20 flex items-center justify-center">
                    <span className="text-tertiary font-bold text-xl">
                      Company Logo
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl italic mb-6">
                  &quot;Implementing this platform has been transformative for
                  our business. We&apos;ve seen dramatic improvements in
                  efficiency, team collaboration, and overall output quality.
                  The ROI has been exceptional. &quot;
                </p>
                <div>
                  <p className="font-bold text-lg">Sarah Johnson</p>
                  <p className="text-gray-600">
                    Chief Operations Officer, TechCorp Inc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-800 py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience These Benefits?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Join thousands of satisfied customers who have transformed their
            businesses with our platform.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-800 font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2 mx-auto">
            Contact us
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comparison Section */}
    </div>
  );
}
