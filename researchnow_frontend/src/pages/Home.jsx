import React from "react";
import HeroSection from "../components/Heropage/HeroSection.jsx"; // ✅ Correct Import

const Home = () => {
  return (
    <div>
      <HeroSection />  {/* ✅ Ensure this is included */}
    </div>
  );
};

export default Home;
