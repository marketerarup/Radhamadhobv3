import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CinematicCard3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glareIntensity?: number;
  maxTilt?: number;
}

export const CinematicCard3D: React.FC<CinematicCard3DProps> = ({
  children,
  className = '',
  onClick,
  glareIntensity = 0.22,
  maxTilt = 6,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [supportsHover, setSupportsHover] = useState(true);

  // Performance & Device Check: Disable heavy 3D tilt tracking on mobile/touch devices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(hover: hover) and (pointer: fine)');
      setSupportsHover(media.matches);
      const listener = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!supportsHover) return;

      const card = cardRef.current;
      if (!card) return;

      // Throttle mouse tracking via requestAnimationFrame for silky 60/120fps performance
      if (rafId.current !== null) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXVal = ((y - centerY) / centerY) * -maxTilt;
        const rotateYVal = ((x - centerX) / centerX) * maxTilt;

        const lightX = (x / rect.width) * 100;
        const lightY = (y / rect.height) * 100;

        setTilt({ rotateX: rotateXVal, rotateY: rotateYVal });
        setLightPos({ x: lightX, y: lightY });
      });
    },
    [maxTilt, supportsHover]
  );

  const handleMouseEnter = () => {
    if (supportsHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setLightPos({ x: 50, y: 50 });
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      className="relative group/cinematic-card w-full h-full perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ================================================================= */}
      {/* 1. CINEMATIC AMBIENT LIGHTING BEHIND CARD (Apple / Hollywood)     */}
      {/* The light moves strictly BEHIND the card, casting ambient glow.   */}
      {/* Never overlaps content, never covers typography.                  */}
      {/* ================================================================= */}
      <div
        className="pointer-events-none absolute -inset-3 sm:-inset-4 rounded-3xl transition-opacity duration-500 z-0 will-change-transform"
        style={{
          background: `radial-gradient(380px circle at ${lightPos.x}% ${lightPos.y}%, rgba(212, 175, 55, ${
            glareIntensity * 0.95
          }), rgba(153, 0, 0, 0.16) 45%, transparent 75%)`,
          opacity: isHovered && supportsHover ? 1 : 0,
          filter: 'blur(24px)',
          transform:
            isHovered && supportsHover
              ? `translate3d(${(lightPos.x - 50) * 0.14}px, ${(lightPos.y - 50) * 0.14}px, -20px)`
              : 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: Subtle golden ambient depth halo */}
      <div
        className="pointer-events-none absolute -inset-1.5 rounded-2xl transition-opacity duration-700 z-0"
        style={{
          background: `radial-gradient(280px circle at ${lightPos.x}% ${lightPos.y}%, rgba(253, 230, 138, 0.12), transparent 70%)`,
          opacity: isHovered && supportsHover ? 1 : 0,
          filter: 'blur(12px)',
        }}
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* 2. CARD SURFACE (Elevated with 3D tilt, subtle lift & shadows)    */}
      {/* ================================================================= */}
      <div
        ref={cardRef}
        onClick={onClick}
        className={`relative z-10 w-full h-full transform-style-3d cursor-pointer ${className}`}
        style={{
          transform:
            isHovered && supportsHover
              ? `translateY(-5px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg)`
              : 'translateY(0px) rotateX(0deg) rotateY(0deg)',
          transition:
            isHovered && supportsHover
              ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease'
              : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.5s ease',
          boxShadow:
            isHovered && supportsHover
              ? '0 24px 50px -12px rgba(0, 0, 0, 0.9), 0 0 28px -4px rgba(212, 175, 55, 0.16), inset 0 1px 0 rgba(253, 230, 138, 0.25)'
              : '0 12px 30px -10px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(253, 230, 138, 0.08)',
        }}
      >
        {/* =============================================================== */}
        {/* 3. DYNAMIC CONTRAST PROTECTION & BEVEL GLASS FLOOR               */}
        {/* Deep obsidian floor behind content; NO layer on top of children */}
        {/* =============================================================== */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-0"
          aria-hidden="true"
        />

        {/* Subtle Specular Edge Sheen (Strictly perimeter, behind content) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 260px at ${lightPos.x}% ${lightPos.y}%, rgba(212, 175, 55, 0.08), transparent 70%)`,
            opacity: isHovered && supportsHover ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Top Bevel Highlight (1px gold-sheen edge simulating physical glass) */}
        <div
          className="pointer-events-none absolute top-0 inset-x-0 h-px rounded-t-[inherit] bg-gradient-to-r from-transparent via-[#FDE68A]/35 to-transparent z-[1]"
          aria-hidden="true"
        />

        {/* =============================================================== */}
        {/* 4 & 5. CONTENT, TYPOGRAPHY & BUTTONS                             */}
        {/* Elevated with z-10 and cinematic-text-protect for contrast       */}
        {/* =============================================================== */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between cinematic-text-protect">
          {children}
        </div>
      </div>
    </div>
  );
};
