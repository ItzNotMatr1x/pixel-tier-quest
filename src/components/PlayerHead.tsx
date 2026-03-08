import React from "react";

interface PlayerHeadProps {
  name: string;
  size?: number;
  className?: string;
  /** If true, hover works on the head itself. If false (default), uses group-hover from parent row. */
  selfHover?: boolean;
}

export function PlayerHead({ name, size = 32, className = "", selfHover = false }: PlayerHeadProps) {
  const headUrl = `https://mc-heads.net/head/${name}/64`;

  const hoverClass = selfHover
    ? 'hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.2)] hover:[filter:drop-shadow(0_4px_14px_rgba(0,200,255,0.4))]'
    : 'group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.2)] group-hover:[filter:drop-shadow(0_4px_14px_rgba(0,200,255,0.4))]';

  return (
    <div
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size, perspective: 300 }}
    >
      <img
        src={headUrl}
        alt={name}
        className={`w-full h-full transition-all duration-400 ease-out ${hoverClass}`}
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
