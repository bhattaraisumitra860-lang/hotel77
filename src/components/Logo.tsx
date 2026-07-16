import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return <img src="/logo.png" alt="Hotel Logo" className={className} />;
}
