"use client";
import { Button } from "@/components/ui/button";
import {
  AlignHorizontalDistributeCenter,
  BookAudio,
  Briefcase,
  CircleArrowOutDownRight,
  Lightbulb,
  Volume1,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { FaGooglePlay, FaSpotify, FaAirbnb } from "react-icons/fa";
import { GrGoogleWallet } from "react-icons/gr";
import { CgAdidas } from "react-icons/cg";
import { SiPuma } from "react-icons/si";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="font-mona">
      <div className="flex justify-around">
        <div className="flex  flex-col  mt-[10%]  w-[40%] space-y-5">
          <h1 className="text-5xl font-bold leading-[3.2rem]">
            Make <span className="text-tertiary">Science</span> Accessible,
            <span className="text-tertiary"> Engaging</span>, and{" "}
            <span className="text-tertiary relative">
              Inclusive
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C47.6667 1.83333 154.4 -2.6 199 5"
                  stroke="#00C897"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            for All
          </h1>

          <p className="text-lg text-[#646464]">
            Cognit is a mobile platform built to break barriers in science
            education across Bangladesh. From interactive simulations to
            voice-assisted navigation, — we’re making science learning
            inclusive, fun, and impactful for everyone.
          </p>

          <div className="space-x-4">
            <button
              onClick={() => {
                router.push("/signin");
              }}
              className="bg-tertiary px-6 py-2 rounded-sm text-white font-medium"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                router.push("/signup");
              }}
              className="bg-[#EAFFF9]  px-6 py-2 rounded-sm text-tertiary font-medium"
            >
              Signup
            </button>
          </div>
          <div className="flex space-x-4 mt-3">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-2 rounded-lg bg-[#FFF6E9]">
                <Briefcase className="text-[#F1BF5A] h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Science for All</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-2 rounded-lg bg-[#FFEEEA]">
                <Volume1 className="text-[#F4876B] h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Visual Learning</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="p-2 rounded-lg bg-[#F9EAFF]">
                <Lightbulb className="text-[#B4708D] h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Creative Thinking</span>
            </motion.div>
          </div>
        </div>
        <div className="relative mb-10">
          {" "}
          {/* Added relative positioning container */}
          {/* Image Container - Centered */}
          <h1 className="bg-tertiary rounded-full w-6 h-6 mx-10"></h1>
          <div className="bg-tertiary w-[420px] h-[420px] rounded-full flex items-center justify-center overflow-hidden mx-auto">
            <Image
              src="/images/student2.png"
              width={300}
              height={300}
              className="object-cover w-[90%] h-full mt-8 mr-12"
              alt="student"
            />
          </div>
          <h1 className="bg-tertiary rounded-full w-6 h-6"></h1>
          {/* Cards - Positioned absolutely around the image */}
          <div className="absolute top-1/4 -left-36 w-[220px] shadow-lg rounded-sm bg-white border-[#20B486] border-[1px] p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
            <div className="flex items-center justify-center bg-[#20B486] rounded-xl w-12 h-12 text-white p-2 transition-all duration-300 group-hover:rotate-12">
              <AlignHorizontalDistributeCenter className="w-6 h-6" />
            </div>
            <div className="text-right ml-3">
              <h1 className="text-2xl font-bold text-[#20B486]">2K+</h1>
              <p className="text-sm font-medium text-gray-600 mt-1">
                Video Courses
              </p>
            </div>
          </div>
          <div className="absolute top-[10%] -right-10 w-[180px] shadow-lg rounded-sm bg-white border-[#20B486] border-[1px] p-4 flex justify-between items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
            <div className="flex items-center justify-center bg-[#20B486] rounded-xl w-12 h-12 text-white p-2 transition-all duration-300 group-hover:-rotate-12">
              <CircleArrowOutDownRight className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-[#20B486]">5K+</h1>
              <p className="text-xs font-medium text-gray-600 mt-1">
                Online course
              </p>
            </div>
          </div>
          <div className="absolute bottom-10 -right-10 w-[150px] shadow-lg rounded-sm bg-white border-[#20B486] border-[1px] p-3 flex justify-between items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
            <div className="flex items-center justify-center bg-[#20B486] rounded-xl w-10 h-10 text-white p-2 transition-all duration-300 group-hover:rotate-6">
              <BookAudio className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600">Tutor</p>
              <h1 className="text-xl font-bold text-[#20B486]">250+</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-12">
        <div className="flex flex-wrap justify-evenly gap-x-8 gap-y-8 items-center px-4">
          {/* Google Play - Green */}
          <div className="flex items-center space-x-2 group">
            <FaGooglePlay className="text-3xl text-[#0F9D58] group-hover:scale-110 transition-transform" />
            <h1 className="font-medium text-sm text-gray-600 group-hover:text-[#0F9D58] transition-colors">
              Google Play
            </h1>
          </div>

          {/* Spotify - Green */}
          <div className="flex items-center space-x-2 group">
            <FaSpotify className="text-3xl text-[#1DB954] group-hover:scale-110 transition-transform" />
            <h1 className="font-medium text-sm text-gray-600 group-hover:text-[#1DB954] transition-colors">
              Spotify
            </h1>
          </div>

          {/* Airbnb - Pink */}
          <div className="flex items-center space-x-2 group">
            <FaAirbnb className="text-3xl text-[#FF5A5F] group-hover:scale-110 transition-transform" />
            <h1 className="font-medium text-sm text-gray-600 group-hover:text-[#FF5A5F] transition-colors">
              Airbnb
            </h1>
          </div>

          {/* Google Wallet - Blue */}
          <div className="flex items-center space-x-2 group">
            <GrGoogleWallet className="text-3xl text-[#4285F4] group-hover:scale-110 transition-transform" />
            <h1 className="font-medium text-sm text-gray-600 group-hover:text-[#4285F4] transition-colors">
              Google Wallet
            </h1>
          </div>

          {/* Adidas - Black */}
          <div className="flex items-center space-x-2 group">
            <CgAdidas className="text-3xl text-black group-hover:scale-110 transition-transform" />
            <h1 className="font-medium text-sm text-gray-600 group-hover:text-black transition-colors">
              Adidas
            </h1>
          </div>

          {/* Puma - Red */}
          <div className="flex items-center space-x-2 group">
            <SiPuma className="text-3xl text-[#D5121A] group-hover:scale-110 transition-transform" />
            <h1 className="font-medium text-sm text-gray-600 group-hover:text-[#D5121A] transition-colors">
              Puma
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
