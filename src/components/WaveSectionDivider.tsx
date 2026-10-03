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
 * (Disabled / Removed as requested)
 */
export const WaveSectionDivider: React.FC<WaveSectionDividerProps> = () => null;

/**
 * Traditional Bengali Alpana / Temple Border Header Ornament
 * (Disabled / Removed as requested)
 */
export const BengaliAlpanaDivider: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = () => null;
