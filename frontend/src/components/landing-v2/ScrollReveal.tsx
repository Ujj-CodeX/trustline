"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down";
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const translateClass =
    direction === "down"
      ? "translate-y-[-24px]"
      : "translate-y-6";

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : `opacity-0 ${translateClass}`,
        className,
      ].join(" ")}
      style={{
        transitionDelay: `${delay * 1000}ms`,
      }}
    >
      {children}
    </div>
  );
}