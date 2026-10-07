"use client";
import React from "react";
import { EmergencyBar } from "./EmergencyBar";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

import ProductExperienceDemo from "./ProductExperienceDemo";
import HowItWorksSection from "./HowItWorksSection";
import TrustSection from "./TrustSection";

import LocationSection from "./LocationSection";
import FinalCTA from "./FinalCTA";
import { Footer } from "./Footer";

export default function LandingPage() {
  const handleFindHelpClick = () => {
    document
      .getElementById("hero-composer")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const handleRouteSubmit = (
    query: string,
    country: string
  ) => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (country) {
      params.set("country", country);
    }

    window.location.href = `/chat?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-clip">
      <header className="fixed top-0 left-0 right-0 z-[60]">
        <EmergencyBar />
        <Navbar onFindHelpClick={handleFindHelpClick} />
      </header>

      <main>
        <HeroSection onRouteSubmit={handleRouteSubmit}/>
        <ProductExperienceDemo />
        <HowItWorksSection />

        <TrustSection />

        <LocationSection />

        <FinalCTA onRouteSubmit={handleRouteSubmit} />
        <Footer  />

        {/* Step 5 onwards will go here */}
      </main>
    </div>
  );
}