import React from 'react';

export type LogoVariant = 'arched-emblem' | 'horizontal-lockup' | 'medallion-seal';
export type LogoColorway = 'vermilion' | 'black' | 'white';

interface OfficialLogoProps {
  variant?: LogoVariant;
  colorway?: LogoColorway;
  className?: string;
}

const COLOR_MAP: Record<LogoColorway, string> = {
  vermilion: '#FF0000',
  black: '#000000',
  white: '#FFFFFF',
};

/**
 * Faithful SVG reproduction of the official logos of
 * রাধামাধব সাংস্কৃতিক জোট (রাধামাধব সনাতন সাংস্কৃতিক জোট)
 * Preserves the exact Nataraja cosmic dance silhouette inside the 21-flame
 * Prabhamandala ring, lotus pedestal base, dual four-dot Swastika emblems,
 * and bold Bengali typography across Arched Emblem, Horizontal Lockup, and
 * Official Medallion Seal formats.
 */
export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  variant = 'horizontal-lockup',
  colorway = 'vermilion',
  className = '',
}) => {
  const fill = COLOR_MAP[colorway];

  // Generate 21 flame tips around the Prabhamandala arch (from -200 deg to +20 deg)
  const flames = Array.from({ length: 21 }, (_, i) => {
    const angleDeg = -200 + i * (220 / 20);
    const angleRad = (angleDeg * Math.PI) / 180;
    const cx = 150 + 104 * Math.cos(angleRad);
    const cy = 155 + 104 * Math.sin(angleRad);
    const rot = angleDeg + 90;
    return { cx, cy, rot, key: i };
  });

  const renderNatarajaEmblem = (customFill: string) => (
    <g fill={customFill}>
      {/* Outer Prabhamandala (Ring of Fire) */}
      <path
        d="M 150 51 A 104 104 0 1 0 254 155 A 104 104 0 0 0 150 51 Z M 150 64 A 91 91 0 1 1 59 155 A 91 91 0 0 1 150 64 Z"
        fillRule="evenodd"
      />

      {/* 21 Traditional Three-Lobed Flame Finials */}
      {flames.map((f) => (
        <g
          key={f.key}
          transform={`translate(${f.cx.toFixed(1)}, ${f.cy.toFixed(1)}) rotate(${f.rot.toFixed(1)})`}
        >
          <path d="M 0 -14 C 4 -9 5 -4 3 1 C 7 -3 9 1 6 5 C 4 8 -4 8 -6 5 C -9 1 -7 -3 -3 1 C -5 -4 -4 -9 0 -14 Z" />
        </g>
      ))}

      {/* Flying Jata (Sacred Locks of Hair) + Crown */}
      <path d="M 150 63 C 157 63 162 72 160 85 C 158 95 164 102 161 112 L 139 112 C 136 102 142 95 140 85 C 138 72 143 63 150 63 Z" />

      {/* Left Hair Fan (Jata-bhara lattice) */}
      <path
        fillRule="evenodd"
        d="M 138 89 C 118 76 92 86 84 110 C 82 117 88 124 98 124 C 112 124 126 118 139 114 Z
           M 129 91 C 122 87 112 89 108 95 C 115 98 123 96 129 91 Z
           M 104 98 C 96 101 91 108 92 114 C 99 114 105 108 104 98 Z
           M 126 101 C 118 102 112 107 111 114 C 119 114 126 109 126 101 Z"
      />

      {/* Right Hair Fan (Jata-bhara lattice) */}
      <path
        fillRule="evenodd"
        d="M 162 89 C 182 76 208 86 216 110 C 218 117 212 124 202 124 C 188 124 174 118 161 114 Z
           M 171 91 C 178 87 188 89 192 95 C 185 98 177 96 171 91 Z
           M 196 98 C 204 101 209 108 208 114 C 201 114 195 108 196 98 Z
           M 174 101 C 182 102 188 107 189 114 C 181 114 174 109 174 101 Z"
      />

      {/* Nataraja Four-Armed Cosmic Dance Silhouette */}
      <path d="M 145 110 C 128 114 112 124 98 131 C 92 123 89 113 94 105 L 84 107 C 77 120 82 136 96 144 C 108 142 120 137 132 135 C 115 142 98 152 94 166 L 101 168 C 108 156 124 150 139 146 C 145 154 148 162 142 170 C 122 178 101 195 86 208 C 84 212 88 219 95 217 C 112 108 128 197 144 190 C 139 205 133 216 136 224 C 141 234 152 246 156 254 L 172 254 C 169 242 156 228 152 218 C 155 208 164 198 166 190 C 174 189 182 188 186 188 C 189 178 184 163 172 154 C 173 149 175 144 177 140 C 192 142 204 148 212 145 C 222 138 231 121 238 109 L 229 104 C 222 116 214 129 206 132 C 194 130 182 122 168 116 Z" />

      {/* Flowing Angavastra (Celestial Sash ribbons on right & left) */}
      <path d="M 171 146 C 194 148 212 172 239 186 L 236 195 C 212 182 195 162 170 155 Z" />
      <path d="M 176 156 C 202 166 221 188 234 214 L 226 219 C 214 195 196 175 172 164 Z" />
      <path d="M 96 142 C 82 146 76 164 62 162 L 60 169 C 78 172 86 154 99 149 Z" />

      {/* Lotus Pedestal & Architectural Base */}
      <path
        fillRule="evenodd"
        d="M 112 246 L 188 246 L 194 286 L 202 292 L 204 316 L 96 316 L 106 296 L 103 292 L 108 246 Z
           M 120 262 C 117 268 119 278 122 284 C 128 282 132 276 128 268 C 125 264 122 262 120 262 Z
           M 180 264 C 175 266 172 274 176 280 C 180 280 183 274 180 264 Z"
      />

      {/* Left Auspicious Swastika with Four Bindu Dots */}
      <g transform="translate(48, 272) scale(0.75)">
        <path d="M 0 -28 L 0 28 M -28 0 L 28 0" stroke={customFill} strokeWidth="9" strokeLinecap="round" />
        <path d="M 0 -26 C 14 -26 24 -26 32 -34 C 28 -20 18 -19 0 -19 Z" />
        <path d="M 26 0 C 26 14 26 24 34 32 C 20 28 19 18 19 0 Z" />
        <path d="M 0 26 C -14 26 -24 26 -32 34 C -28 20 -18 19 0 19 Z" />
        <path d="M -26 0 C -26 -14 -26 -24 -34 -32 C -20 -28 -19 -18 -19 0 Z" />
        <circle cx="13" cy="-13" r="4.5" />
        <circle cx="13" cy="13" r="4.5" />
        <circle cx="-13" cy="13" r="4.5" />
        <circle cx="-13" cy="-13" r="4.5" />
      </g>

      {/* Right Auspicious Swastika with Four Bindu Dots */}
      <g transform="translate(252, 272) scale(0.75)">
        <path d="M 0 -28 L 0 28 M -28 0 L 28 0" stroke={customFill} strokeWidth="9" strokeLinecap="round" />
        <path d="M 0 -26 C 14 -26 24 -26 32 -34 C 28 -20 18 -19 0 -19 Z" />
        <path d="M 26 0 C 26 14 26 24 34 32 C 20 28 19 18 19 0 Z" />
        <path d="M 0 26 C -14 26 -24 26 -32 34 C -28 20 -18 19 0 19 Z" />
        <path d="M -26 0 C -26 -14 -26 -24 -34 -32 C -20 -28 -19 -18 -19 0 Z" />
        <circle cx="13" cy="-13" r="4.5" />
        <circle cx="13" cy="13" r="4.5" />
        <circle cx="-13" cy="13" r="4.5" />
        <circle cx="-13" cy="-13" r="4.5" />
      </g>
    </g>
  );

  if (variant === 'medallion-seal') {
    return (
      <svg
        viewBox="0 0 380 380"
        className={`select-none ${className}`}
        role="img"
        aria-label="রাধামাধব সাংস্কৃতিক জোট - Official Red Medallion Seal"
      >
        <circle cx="190" cy="190" r="184" fill="#CC0000" stroke="#D4AF37" strokeWidth="8" />
        <circle cx="190" cy="190" r="174" fill="#FF0000" />
        <defs>
          <path
            id="medallion-text-path"
            d="M 48 228 A 144 144 0 1 1 332 228"
            fill="none"
          />
        </defs>
        <text
          fill="#FFFFFF"
          fontSize="31"
          fontWeight="800"
          fontFamily="'Noto Serif Bengali', 'Hind Siliguri', serif"
          letterSpacing="1"
        >
          <textPath
            href="#medallion-text-path"
            startOffset="50%"
            textAnchor="middle"
          >
            রাধামাধব সাংস্কৃতিক জোট
          </textPath>
        </text>
        <g transform="translate(40, 26)">{renderNatarajaEmblem('#FFFFFF')}</g>
      </svg>
    );
  }

  if (variant === 'arched-emblem') {
    return (
      <svg
        viewBox="0 0 360 340"
        className={`select-none ${className}`}
        role="img"
        aria-label="রাধামাধব সনাতন সাংস্কৃতিক জোট - Official Arched Emblem Logo"
      >
        <defs>
          <path
            id={`arched-text-path-${colorway}`}
            d="M 34 225 A 148 148 0 1 1 326 225"
            fill="none"
          />
        </defs>
        <text
          fill={fill}
          fontSize="31"
          fontWeight="800"
          fontFamily="'Noto Serif Bengali', 'Hind Siliguri', serif"
          letterSpacing="1"
        >
          <textPath
            href={`#arched-text-path-${colorway}`}
            startOffset="50%"
            textAnchor="middle"
          >
            রাধামাধব সনাতন সাংস্কৃতিক জোট
          </textPath>
        </text>
        <g transform="translate(30, 16)">{renderNatarajaEmblem(fill)}</g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 980 320"
      className={`select-none ${className}`}
      role="img"
      aria-label="রাধামাধব সনাতন সাংস্কৃতিক জোট - Official Horizontal Logo"
    >
      <g transform="translate(5, -2)">{renderNatarajaEmblem(fill)}</g>
      <g fill={fill} fontFamily="'Hind Siliguri', 'Noto Serif Bengali', sans-serif" fontWeight="700">
        <text x="315" y="138" fontSize="102" letterSpacing="-1">
          রাধামাধব সনাতন
        </text>
        <text x="315" y="258" fontSize="102" letterSpacing="-1">
          সাংস্কৃতিক জোট
        </text>
      </g>
    </svg>
  );
};
