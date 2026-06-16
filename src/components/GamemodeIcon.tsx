import React from "react";
import crystalIcon from "@/assets/crystal.svg";
import swordIcon from "@/assets/sword.svg";
import axeIcon from "@/assets/axe.svg";
import nethpotIcon from "@/assets/nethpot.svg";
import potIcon from "@/assets/pot.svg";
import uhcIcon from "@/assets/uhc.svg";
import smpIcon from "@/assets/smp.svg";
import maceIcon from "@/assets/mace.svg";
import overallIcon from "@/assets/overall.svg";
import spearMaceAsset from "@/assets/spear-mace.png.asset.json";

const iconMap: Record<string, string> = {
  sword: swordIcon,
  axe: axeIcon,
  nethpot: nethpotIcon,
  pot: potIcon,
  vanilla: crystalIcon,
  uhc: uhcIcon,
  smp: smpIcon,
  mace: maceIcon,
  spearmace: spearMaceAsset.url,
  overall: overallIcon,
};

interface GamemodeIconProps {
  icon: string;
  className?: string;
  gamemodeId?: string;
}

export function GamemodeIcon({ icon, className = "w-6 h-6", gamemodeId }: GamemodeIconProps) {
  const src = gamemodeId ? iconMap[gamemodeId] : iconMap[icon];
  if (src) {
    return <img src={src} alt={gamemodeId || icon} className={className} />;
  }
  return <span className={className}>{icon}</span>;
}
