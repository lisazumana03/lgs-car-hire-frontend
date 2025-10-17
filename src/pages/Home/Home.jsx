import Hero from "../../components/public/Hero";
import PlanTrip from "../../components/public/PlanTrip";
import Banner from "../../components/public/Banner";
import ChooseUs from "../../components/public/ChooseUs";
import Testimonials from "../../components/public/Testimonials";
import Faq from "../../components/public/Faq";
import Download from "../../components/public/Download";

function Home() {
  return (
    <>
      <Hero />
      <PlanTrip />
      <Banner />
      <ChooseUs />
      <Testimonials />
      <Faq />
      <Download />
    </>
  );
}

export default Home;