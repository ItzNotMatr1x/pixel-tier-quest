import React, { useState } from "react";

interface PlayerHeadProps {
  name: string;
  size?: number;
  className?: string;
  selfHover?: boolean;
}

const STEVE_URL = "https://visage.surgeplay.com/bust/256/MHF_Steve";

export function PlayerHead({ name, size = 32, className = "", selfHover = false }: PlayerHeadProps) {
  const [src, setSrc] = useState(`https://visage.surgeplay.com/bust/256/${name}`);

  const hoverTransform = selfHover
    ? 'hover:scale-110 hover:[filter:drop-shadow(0_4px_18px_hsl(190_100%_50%/0.5))]'
    : 'group-hover:scale-110 group-hover:[filter:drop-shadow(0_4px_18px_hsl(190_100%_50%/0.5))]';

  return (
    <div
      className={`relative inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size * 1.4, perspective: 300 }}
    >
      <img
        src={src}
        alt={name}
        onError={() => { if (src !== STEVE_URL) setSrc(STEVE_URL); }}
        className={`h-full w-full rounded-md object-contain transition-all duration-[400ms] ease-out [filter:drop-shadow(0_2px_8px_hsl(190_100%_50%/0.3))_drop-shadow(0_4px_12px_rgba(0,0,0,0.5))] ${hoverTransform}`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-primary/80 ring-2 ring-primary/60 shadow-[0_0_16px_4px_hsl(var(--primary)/0.8),inset_0_0_12px_hsl(var(--primary)/0.5)]" />
      <div className="pointer-events-none absolute inset-[3px] rounded-[6px] border-2 border-primary/30 shadow-[inset_0_2px_8px_hsl(var(--primary)/0.3)]" />
    </div>
  );
}
