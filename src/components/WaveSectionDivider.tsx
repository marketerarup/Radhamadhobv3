import React from 'react';

interface WaveSectionDividerProps {
  /** Color of the top/previous section background */
  topBg?: string;
  /** Color of the bottom/next section background */
  bottomBg?: string;
  /** Accent color variant */
  variant?: 'red-gold-green' | 'gold-green' | 'crimson-gold';
  /** Flip wave horizontally */
  flip?: boolean;
}

/**
 * Traditional Bengali Cultural NGO Layered Wave Section Divider
 * Combines Vermilion Red (#990000/#CC0000), Temple Gold (#D4AF37), and Mango-Leaf Green (#0F5132)
 */
export const WaveSectionDivider: React.FC<WaveSectionDividerProps> = ({
  topBg = '#FAF7F0',
  bottomBg = '#F3EFE6',
  variant = 'red-gold-green',
  flip = false,
}) => {
  const strokeMain =
    variant === 'gold-green'
      ? '#0F5132'
      : variant === 'crimson-gold'
      ? '#990000'
      : '#CC0000';
  const strokeAccent = '#D4AF37';

  return (
    <div
      className="relative w-full overflow-hidden leading-none select-none pointer-events-none"
      style={{ backgroundColor: topBg }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-10 sm:h-14 lg:h-18 block ${flip ? 'scale-x-[-1]' : ''}`}
        preserveAspectRatio="none"
      >
        {/* Subtle Mango-Leaf Green Back Wave */}
        <path
          d="M0 32C240 78 480 4 720 34C960 64 1200 12 1440 38V84H0V32Z"
          fill="#0F5132"
          fillOpacity="0.12"
        />
        {/* Temple Gold Middle Wave */}
        <path
          d="M0 48C300 6 600 76 900 40C1140 12 1320 52 1440 30V84H0V48Z"
          fill={strokeAccent}
          fillOpacity="0.24"
        />
        {/* Primary Bottom Fill Wave */}
        <path
          d="M0 54C280 18 560 80 880 46C1140 18 1310 56 1440 42V84H0V54Z"
          fill={bottomBg}
        />
        {/* Crisp Golden & Crimson Ornamental Thread Line */}
        <path
          d="M0 54C280 18 560 80 880 46C1140 18 1310 56 1440 42"
          stroke={strokeAccent}
          strokeWidth="2.5"
        />
        <path
          d="M0 50C280 14 560 76 880 42C1140 14 1310 52 1440 38"
          stroke={strokeMain}
          strokeWidth="1.2"
          strokeOpacity="0.55"
        />
      </svg>
    </div>
  );
};

/**
 * Traditional Bengali Alpana / Temple Border Header Ornament
 */
export const BengaliAlpanaDivider: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
    <div className="h-0.5 w-10 bg-gradient-to-r from-[#990000] to-[#D4AF37]" />
    <span className="inline-block w-2 h-2 rotate-45 bg-[#CC0000] border border-[#D4AF37]" />
    <span className="inline-block w-2.5 h-2.5 rotate-45 bg-[#0F5132] border border-[#D4AF37]" />
    <span className="inline-block w-2 h-2 rotate-45 bg-[#CC0000] border border-[#D4AF37]" />
    <div className="h-0.5 w-10 bg-gradient-to-l from-[#0F5132] to-[#D4AF37]" />
  </div>
);
