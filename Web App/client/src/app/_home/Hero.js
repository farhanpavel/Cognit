"use client";
import { Button } from "@/components/ui/button";
import {
  AlignEndHorizontal,
  AlignHorizontalJustifyCenter,
  AudioWaveform,
  Blinds,
  BrickWall,
  CircleAlert,
  CircleArrowOutUpRight,
  CircleCheck,
  Router,
} from "lucide-react";
import React from "react";
import { FaGooglePlay, FaSpotify, FaAirbnb } from "react-icons/fa";
import { GrGoogleWallet } from "react-icons/gr";
import { CgAdidas } from "react-icons/cg";
import { SiPuma } from "react-icons/si";
import { useRouter } from "next/navigation";
export default function Hero() {
  const router = useRouter();
  return (
    <div className="font-mona">
      <div>
        <div className="flex flex-col items-center justify-center mt-[4%] ">
          <div>
            <h1 className="text-6xl font-semibold leading-[4.2rem] text-[#322372]">
              Top <span className="text-tertiary">Sales Funnel Builder</span> to
              Boost <br /> Conversation & Maximize Profits
            </h1>
          </div>
          <div>
            <p className="text-[#5a5a5a] text-lg font-medium w-[65%] mx-auto text-center mt-7">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et quae
              consequuntur eligendi veniam tempore, commodi quas minima unde
              corporis provident Lorem ipsum dolor sit..
            </p>
          </div>
          <div className="grid grid-cols-6 gap-10 mt-10">
            <div>
              <CircleCheck
                strokeWidth={2}
                className="w-20 h-20   text-tertiary shadow-xl bg-white p-6 rounded-lg"
              />
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Wordpress <br /> Developer
              </h1>
            </div>
            <div>
              <AlignHorizontalJustifyCenter
                strokeWidth={2}
                className="w-20 h-20   text-tertiary shadow-xl bg-white p-6 rounded-lg"
              />
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Hello <br /> Word
              </h1>
            </div>
            <div>
              <AudioWaveform
                strokeWidth={2}
                className="w-20 h-20  text-tertiary shadow-xl bg-white p-6 rounded-lg"
              />
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Ki Khobor <br /> Pavel
              </h1>
            </div>
            <div>
              <Blinds
                strokeWidth={2}
                className="w-20 h-20  text-tertiary shadow-xl bg-white p-6 rounded-lg"
              />
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                kemon <br /> Asow
              </h1>
            </div>
            <div>
              <BrickWall
                strokeWidth={2}
                className="w-20 h-20  text-tertiary  shadow-xl bg-white p-6 rounded-lg"
              />
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Pari na <br /> kist
              </h1>
            </div>
            <div>
              <CircleArrowOutUpRight
                strokeWidth={2}
                className="w-20 h-20   text-tertiary shadow-xl bg-white p-6 rounded-lg"
              />
              <h1 className="text-xs leading-4 text-center mt-2 text-[#322372] font-semibold">
                Parow tw <br /> naki
              </h1>
            </div>
          </div>
          <div className="space-x-5 mt-[4%]">
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              className="rounded-lg px-10 bg-tertiary text-white hover:bg-purple-700"
            >
              Signin
            </Button>
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              className="rounded-lg px-10 border-tertiary bg-white border-[1.5px] text-tertiary hover:bg-white hover:text-tertiary"
            >
              Signup
            </Button>
          </div>
        </div>
        <div className="mt-[7%]">
          <h1 className="text-[#322372] text-2xl font-semibold text-center">
            Recommended and used by{" "}
            <span className="text-tertiary">amazing business</span>
          </h1>
          <div className="flex  py-10 justify-center space-x-[5%] items-center">
            <div className="flex items-center space-x-2 opacity-50">
              <FaGooglePlay className="text-3xl " />
              <h1 className="font-semibold text-sm">Google Pay</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <FaSpotify className="text-3xl" />
              <h1 className="font-semibold text-sm">Spotify</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <FaAirbnb className="text-3xl" />
              <h1 className="font-semibold text-sm">Airbnb</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <GrGoogleWallet className="text-3xl" />
              <h1 className="font-semibold text-sm">Google Wallet</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <CgAdidas className="text-3xl" />
              <h1 className="font-semibold text-sm">Addidas</h1>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <SiPuma className="text-3xl" />
              <h1 className="font-semibold text-sm">Puma</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
