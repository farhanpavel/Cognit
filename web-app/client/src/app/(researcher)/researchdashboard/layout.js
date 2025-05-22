import Residebar from "@/components/ResearchSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <Residebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
