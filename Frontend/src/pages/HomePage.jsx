import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import WorkStepsSection from "../components/home/WorkStepsSection";
import TeamSection from "../components/home/TeamSection";
import GalleryContactSection from "../components/home/GalleryContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkStepsSection />
      <TeamSection />
      <GalleryContactSection />
    </>
  );
}
