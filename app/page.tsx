import Navbar from "@/components/Navbar";
import BirthdaySection from "@/components/home/BirthdaySection";
import YesterdaySection from "@/components/home/YesterdaySection";
import TwinsiesSection from "@/components/home/TwinsiesSection";
import "./style2.css";

// main discovery / homepage
export default function HomePage() {
  return (
    <main className="discovery-page">
      <Navbar />
      <BirthdaySection />
      <YesterdaySection />
      <TwinsiesSection />
    </main>
  );
}