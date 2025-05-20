import Header from "@/components/Header/page";
import Image from "next/image";
import Hero from "./_home/Hero";
import Feature from "./_home/Feature";
import Benefit from "./_home/Benefit";
import Footer from "@/components/Footer/page";
export default function Home() {
  return (
    <div>
      <div className="bg-gradient-to-b from-white to-[#F8FFFC]">
        <Header />
        <Hero />
      </div>
      <div className="bg-white">
        <Feature />
      </div>

      <div>
        <Benefit />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
