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
import Image from "next/image";
export default function Benefit() {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-tertiary" />,
      title: "Visual & Voice-Based Learning",
      description:
        "Cognit blends simulations, voice commands, and visual storytelling to make science accessible for learners of all literacy levels.",
    },
    {
      icon: <Shield className="h-8 w-8 text-tertiary" />,
      title: "Inclusive by Design",
      description:
        "Built with accessibility in mind — screen reader support, audio guidance, and haptic feedback ensure no student is left behind.",
    },
    {
      icon: <Clock className="h-8 w-8 text-tertiary" />,
      title: "Offline Access",
      description:
        "Download lessons, labs, and quizzes once — learn anytime, anywhere. Especially vital for rural and low-connectivity areas.",
    },
    {
      icon: <Users className="h-8 w-8 text-tertiary" />,
      title: "Community & Collaboration",
      description:
        "Participate in science projects, share observations, and collaborate with students nationwide through citizen science modules.",
    },
    {
      icon: <Award className="h-8 w-8 text-tertiary" />,
      title: "Localized & Relatable",
      description:
        "Science explained in Bangla and local dialects, using culturally relevant examples — making learning intuitive and familiar.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-tertiary" />,
      title: "Empowered Learning",
      description:
        "Gamified challenges, progress tracking, and voice-controlled navigation foster independence, curiosity, and motivation.",
    },
  ];

  return (
    <div className="min-h-screen font-mona">
      <div className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">93%</p>
              <p className="text-gray-600">Student Engagement Rate</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-tertiary mb-2">30%</p>
              <p className="text-gray-600">Average tuition cost reduction</p>
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
              Why <span className="text-tertiary">Cognit</span> Works for
              Everyone
            </h2>
            <p className="text-[#5a5a5a] text-sm font-medium w-[50%] mx-auto text-center mt-3 ">
              Cognit is more than an app — it’s a science learning platform
              tailored for every student, regardless of location, ability, or
              language.
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
              Learner Story
            </div>
            <div className="md:flex items-center gap-8">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="/images/review_student.jpg"
                    width={300}
                    height={300}
                    alt="Student giving testimonial"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl italic mb-6">
                  &quot;Before Cognit, I couldn&apos;t understand science classes
                  because I can&apos;t read well. Now I learn by listening and using
                  pictures. I even did a water quality project in my
                  village!&quot;
                </p>
                <div>
                  <p className="font-bold text-lg">Abdullah</p>
                  <p className="text-gray-600">
                    Grade 8 Student, Kurigram District
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
            Bring Science to Every Student
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Partner with us or try Cognit today — empower learners with
            inclusive, offline, and voice-first science education.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-800 font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2 mx-auto">
            Get Involved
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comparison Section */}
    </div>
  );
}
