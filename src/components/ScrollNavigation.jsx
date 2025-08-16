"use client";

import { useEffect, useState } from "react";

export default function ScrollNavigation() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Find all major sections
    const sectionElements = [
      document.querySelector(".header"),
      document.querySelector(".intro-card"),
      document.querySelector(".concepts-section"),
      document.querySelector(".distribution-nav"),
      document.querySelector(".distribution-card"),
      document.querySelector(".footer"),
    ].filter(Boolean);

    setSections(sectionElements);

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);

      // Find current section
      let current = 0;
      sectionElements.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            current = index;
          }
        }
      });
      setCurrentSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToNextSection = () => {
    const nextIndex = Math.min(currentSection + 1, sections.length - 1);
    if (sections[nextIndex]) {
      sections[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToPrevSection = () => {
    const prevIndex = Math.max(currentSection - 1, 0);
    if (sections[prevIndex]) {
      sections[prevIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="scroll-navigation">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="scroll-btn scroll-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <span className="scroll-icon">⬆️</span>
          <span className="scroll-text">TOP</span>
        </button>
      )}

      {/* Section Navigation */}
      <div className="section-nav-container">
        <button
          className="scroll-btn nav-btn prev-btn"
          onClick={scrollToPrevSection}
          disabled={currentSection === 0}
          title="Previous section"
        >
          <span className="scroll-icon">🔼</span>
          <span className="scroll-text">PREV</span>
        </button>

        <div className="section-indicator">
          <span className="section-number">{currentSection + 1}</span>
          <span className="section-divider">/</span>
          <span className="section-total">{sections.length}</span>
        </div>

        <button
          className="scroll-btn nav-btn next-btn"
          onClick={scrollToNextSection}
          disabled={currentSection === sections.length - 1}
          title="Next section"
        >
          <span className="scroll-icon">🔽</span>
          <span className="scroll-text">NEXT</span>
        </button>
      </div>
    </div>
  );
}
