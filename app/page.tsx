import Navbar from "@/components/Navbar";
import BirthdaySection from "@/components/home/BirthdaySection";
import YesterdaySection from "@/components/home/YesterdaySection";
import "./style2.css";

export default function HomePage() {
  return (
    <main className="discovery-page">
      <Navbar />
      <BirthdaySection />
      <YesterdaySection />
    </main>
  );
}