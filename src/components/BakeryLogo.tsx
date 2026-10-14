import React from 'react';

interface BakeryLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'stamp';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  showTomaPedidos?: boolean;
}

export const BakeryLogo: React.FC<BakeryLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true,
  showTomaPedidos = false
}) => {
  // Dimensions map - Enhanced for greater visual presence & prominence
  const dimensions = {
    xs: { emblem: 32, textScale: 'text-xs', height: 32 },
    sm: { emblem: 44, textScale: 'text-sm', height: 44 },
    md: { emblem: 56, textScale: 'text-base', height: 56 },
    lg: { emblem: 76, textScale: 'text-xl', height: 76 },
    xl: { emblem: 104, textScale: 'text-2xl', height: 104 },
  }[size];

  // The Iconic "VD" Candy Pastry Mascot SVG
  const EmblemSVG = ({ width = dimensions.emblem, height = dimensions.emblem }: { width?: number; height?: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs select-none"
      aria-label="La Viña Dulce VD Logo"
    >
      <defs>
        {/* Candy Stripes Pattern for letter D */}
        <pattern
          id="vd-candy-stripes"
          width="70"
          height="70"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-40)"
        >
          <rect width="35" height="70" fill="#f45b96" />
          <rect x="35" width="35" height="70" fill="#00b4d8" />
        </pattern>

        {/* 3D Ribbon gradient */}
        <linearGradient id="vd-fold-shadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d83a78" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f45b96" stopOpacity="0" />
        </linearGradient>

        {/* Ganache Gloss Gradient */}
        <linearGradient id="vd-ganache-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2212" />
          <stop offset="50%" stopColor="#5c381e" />
          <stop offset="100%" stopColor="#3d2212" />
        </linearGradient>

        {/* Frosting Swirl Gradient */}
        <linearGradient id="vd-frosting-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Bite Crumb Texture Gradient */}
        <linearGradient id="vd-crumb-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Drop Shadow Filter */}
        <filter id="vd-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Ground caramel/chocolate puddle & shadow */}
      <ellipse cx="140" cy="460" rx="65" ry="14" fill="#a2683b" opacity="0.85" />
      <ellipse cx="145" cy="460" rx="55" ry="9" fill="#5c381e" opacity="0.9" />
      <ellipse cx="320" cy="460" rx="85" ry="8" fill="#cbd5e1" opacity="0.5" />

      {/* --- LETTER D WITH CANDY STRIPES --- */}
      <g filter="url(#vd-soft-shadow)">
        {/* Outer D Body with candy stripes */}
        <path
          d="M 230 115 
             C 270 85, 340 75, 410 90 
             C 475 110, 500 170, 500 270 
             C 500 360, 460 435, 380 455 
             C 310 470, 245 440, 230 420 
             C 220 380, 220 340, 220 300 
             C 215 250, 215 170, 230 115 Z"
          fill="url(#vd-candy-stripes)"
          stroke="#e02970"
          strokeWidth="3"
        />

        {/* Inner Cutout Hole of D (Crisp White) */}
        <path
          d="M 285 185 
             C 335 175, 385 200, 395 270 
             C 405 340, 360 380, 310 380 
             C 285 380, 280 340, 280 280 
             C 280 230, 282 195, 285 185 Z"
          fill="#ffffff"
        />

        {/* Connecting Fold / Shadow between V and D */}
        <path
          d="M 205 155 
             C 225 140, 245 145, 250 170 
             L 245 365 
             C 235 375, 215 360, 205 345 Z"
          fill="url(#vd-fold-shadow)"
        />
      </g>

      {/* --- LETTER V (PINK PASTRY DOUGHNUT WITH BITE & DRIZZLE) --- */}
      <g filter="url(#vd-soft-shadow)">
        {/* Main V Body in Candy Pink */}
        <path
          d="M 80 85 
             C 105 85, 115 115, 120 155 
             L 155 305 
             L 220 190 
             C 230 175, 240 185, 240 205 
             L 170 375 
             C 155 410, 130 460, 85 450 
             C 55 440, 45 390, 50 330 
             L 30 180 
             C 25 130, 45 85, 80 85 Z"
          fill="#f45b96"
        />

        {/* Rounded bottom bowl of V */}
        <path
          d="M 50 330 
             C 50 395, 60 455, 105 455 
             C 145 455, 185 390, 215 320 
             C 170 280, 140 260, 125 315 
             C 115 350, 95 380, 75 365 
             C 60 350, 52 320, 50 330 Z"
          fill="#f45b96"
        />

        {/* --- BITE MARK ON THE LEFT OF V --- */}
        {/* Biscuit layers showing through bite */}
        <path
          d="M 32 195 
             C 38 205, 45 208, 42 220 
             C 38 230, 48 240, 55 248 
             C 62 255, 58 268, 65 278 
             C 72 288, 70 300, 62 312 
             C 55 322, 50 328, 48 335 
             L 38 310 
             L 28 250 
             L 28 210 Z"
          fill="url(#vd-crumb-grad)"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Cream filling inside bite mark */}
        <path
          d="M 38 215 
             C 45 220, 50 228, 48 238 
             C 45 248, 54 256, 58 266 
             C 62 276, 60 286, 52 296 
             L 42 280 
             L 36 230 Z"
          fill="#fff1f2"
        />

        {/* Caramel drip from bite down to ground puddle */}
        <path
          d="M 48 330 
             C 48 350, 50 380, 52 420 
             C 52 435, 50 450, 54 455 
             C 58 455, 58 435, 56 415 
             C 54 375, 53 345, 52 330 Z"
          fill="#a2683b"
        />
        <circle cx="53" cy="452" r="6" fill="#a2683b" />

        {/* Chocolate drip on the bite corner */}
        <path
          d="M 60 270 
             C 62 290, 60 320, 58 350 
             C 56 365, 54 375, 57 378 
             C 60 378, 61 365, 62 345 
             C 65 315, 66 285, 64 270 Z"
          fill="#5c381e"
        />

        {/* --- MELTED CHOCOLATE GANACHE TOP CAP --- */}
        <path
          d="M 28 140 
             C 28 120, 38 95, 65 90 
             C 90 85, 105 105, 115 130 
             C 120 150, 115 170, 108 175 
             C 102 180, 98 160, 92 155 
             C 86 150, 80 185, 72 195 
             C 68 200, 62 190, 60 170 
             C 58 155, 48 180, 42 190 
             C 38 195, 32 185, 32 165 
             C 32 150, 26 160, 24 148 
             Z"
          fill="url(#vd-ganache-grad)"
        />

        {/* Chocolate Ganache Highlights */}
        <path
          d="M 42 110 
             C 52 102, 75 100, 92 112"
          stroke="#854d24"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* --- SWIRLED WHIPPED CYAN FROSTING DOLLOP ON TOP --- */}
        {/* Base swirl */}
        <path
          d="M 35 95 
             C 30 75, 45 45, 65 30 
             C 75 20, 85 5, 88 0 
             C 86 15, 95 30, 98 50 
             C 102 70, 98 90, 85 98 
             C 70 105, 45 105, 35 95 Z"
          fill="url(#vd-frosting-grad)"
        />

        {/* Swirl creases / highlight curves */}
        <path
          d="M 50 85 
             C 45 65, 55 45, 75 30 
             C 82 22, 86 10, 88 0"
          stroke="#e0f2fe"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 65 92 
             C 68 78, 78 62, 92 55"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Chocolate Chips / Sprinkles on the frosting dollop */}
        <circle cx="58" cy="70" r="4.5" fill="#3d2212" />
        <circle cx="72" cy="85" r="3.5" fill="#3d2212" />
        <circle cx="85" cy="65" r="4" fill="#3d2212" />
      </g>
    </svg>
  );

  // Script brand typography rendered in the exact logo styling with high realce
  const BrandTypography = ({ isCentered = false }: { isCentered?: boolean }) => (
    <div className={`flex flex-col select-none ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-baseline gap-1.5 leading-none">
          {/* "La Viña" in vivid cyan script */}
          <span
            className="font-black tracking-tight"
            style={{
              fontFamily: "'Dancing Script', 'Brush Script MT', 'Fraunces', cursive, sans-serif",
              fontSize: size === 'xs' ? '18px' : size === 'sm' ? '22px' : size === 'md' ? '28px' : size === 'lg' ? '38px' : '48px',
              color: '#00b4d8',
              textShadow: '0 2px 4px rgba(0, 180, 216, 0.22)'
            }}
          >
            La Viña
          </span>
          {/* "Dulce" in vivid candy pink script */}
          <span
            className="font-black tracking-tight"
            style={{
              fontFamily: "'Dancing Script', 'Brush Script MT', 'Fraunces', cursive, sans-serif",
              fontSize: size === 'xs' ? '18px' : size === 'sm' ? '22px' : size === 'md' ? '28px' : size === 'lg' ? '38px' : '48px',
              color: '#f45b96',
              textShadow: '0 2px 4px rgba(244, 91, 150, 0.22)'
            }}
          >
            Dulce
          </span>
        </div>

        {showTomaPedidos && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#f45b96] to-[#00b4d8] text-white shadow-xs border border-white/70 ring-1 ring-pink-300">
            TOMA PEDIDOS
          </span>
        )}
      </div>

      {showSubtitle && (
        <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-500 uppercase mt-0.5">
          Pastelería & Panadería · Loja
        </span>
      )}
    </div>
  );

  // VARIANT: Icon only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemSVG />
      </div>
    );
  }

  // VARIANT: Full stacked (Emblem on top, typography below)
  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center text-center gap-1.5 ${className}`}>
        <EmblemSVG width={dimensions.emblem * 1.3} height={dimensions.emblem * 1.3} />
        <BrandTypography isCentered={true} />
      </div>
    );
  }

  // VARIANT: Official Stamp (For receipts & certificates)
  if (variant === 'stamp') {
    return (
      <div className={`inline-flex items-center gap-3 p-2 bg-gradient-to-r from-pink-50/80 via-white to-sky-50/80 rounded-2xl border border-pink-200/90 shadow-2xs ${className}`}>
        <EmblemSVG width={dimensions.emblem} height={dimensions.emblem} />
        <BrandTypography isCentered={false} />
      </div>
    );
  }

  // VARIANT: Horizontal (Default: Emblem on left, typography on right)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <EmblemSVG />
      <BrandTypography isCentered={false} />
    </div>
  );
};
