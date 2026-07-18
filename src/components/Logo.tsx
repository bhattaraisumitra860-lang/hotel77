import React from "react";

interface LogoProps {
  className?: string;
  logoUrl?: string;
}

export default function Logo({ className = "w-10 h-10", logoUrl }: LogoProps) {
  const src = logoUrl || "/uploads/logo.png";
  return <img src={src} alt="Hotel Logo" className={className}
    onError={(e) => { (e.target as HTMLImageElement).src = "/uploads/logo.png"; }}
  />;
}
