import React from "react";

interface PlayerHeadProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Minecraft player head that faces right by default,
 * and rotates to look at the viewer on hover.
 */
export function PlayerHead({ name, size = 32, className = "" }: PlayerHeadProps) {
  const avatarUrl = `https://mc-heads.net/avatar/${name}/64`;

  return (
    <div
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size, perspective: 200 }}
    >
      <img
        src={avatarUrl}
        alt={name}
        className="w-full h-full rounded-sm transition-transform duration-400 ease-out"
        style={{
          imageRendering: 'pixelated',
          transform: 'rotateY(-25deg) scale(1)',
          transformOrigin: 'center center',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLImageElement).style.transform = 'rotateY(0deg) scale(1.15)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLImageElement).style.transform = 'rotateY(-25deg) scale(1)';
        }}
      />
    </div>
  );
}
