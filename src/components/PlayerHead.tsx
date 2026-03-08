import React from "react";

interface PlayerHeadProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * 3D Minecraft player head — faces left by default,
 * rotates to look at viewer when hovering the parent row (group).
 * Uses mc-heads.net/head for 3D isometric head render.
 */
export function PlayerHead({ name, size = 32, className = "" }: PlayerHeadProps) {
  const headUrl = `https://mc-heads.net/head/${name}/64`;

  return (
    <div
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size, perspective: 300 }}
    >
      <img
        src={headUrl}
        alt={name}
        className="w-full h-full transition-all duration-400 ease-out group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.2)] group-hover:[filter:drop-shadow(0_4px_12px_rgba(0,200,255,0.35))]"
        style={{
          imageRendering: 'pixelated',
          transform: 'rotateY(25deg) rotateX(-5deg) scale(1)',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
        }}
      />
    </div>
  );
}
