import React from "react";

interface PlayerHeadProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * 3D Minecraft player head that faces left by default,
 * and rotates to look at the viewer on hover.
 * Uses mc-heads.net/head for 3D isometric head render.
 */
export function PlayerHead({ name, size = 32, className = "" }: PlayerHeadProps) {
  // Use the 3D head render from mc-heads
  const headUrl = `https://mc-heads.net/head/${name}/64`;

  return (
    <div
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size, perspective: 300 }}
    >
      <img
        src={headUrl}
        alt={name}
        className="w-full h-full transition-all duration-400 ease-out cursor-pointer"
        style={{
          imageRendering: 'pixelated',
          transform: 'rotateY(25deg) rotateX(-5deg) scale(1)',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
        }}
        onMouseEnter={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.2)';
          img.style.filter = 'drop-shadow(0 4px 12px rgba(0,200,255,0.3))';
        }}
        onMouseLeave={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.transform = 'rotateY(25deg) rotateX(-5deg) scale(1)';
          img.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))';
        }}
      />
    </div>
  );
}
