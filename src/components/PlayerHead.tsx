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
    </div>
  );
}
