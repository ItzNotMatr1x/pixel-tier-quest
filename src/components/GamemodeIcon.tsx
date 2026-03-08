import React from "react";
import crystalIcon from "@/assets/crystal.svg";

interface GamemodeIconProps {
  icon: string;
  className?: string;
}

export function GamemodeIcon({ icon, className = "w-6 h-6" }: GamemodeIconProps) {
  if (icon === '__crystal__') {
    return <img src={crystalIcon} alt="Vanilla" className={className} />;
  }
  return <span className={className}>{icon}</span>;
}
