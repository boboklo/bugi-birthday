import React from 'react';
import type { MascotMood } from '../types.ts';

interface BugiMascotProps {
  mood?: MascotMood;
  className?: string;
  isJumping?: boolean;
  onClick?: () => void;
}

export const BugiMascot: React.FC<BugiMascotProps> = ({
  mood = 'hi',
  className = 'w-28 h-28',
  isJumping = false,
  onClick,
}) => {
  const heartPath =
    'M12 21.4S3.6 16 3.6 9.6C3.6 6.5 5.9 4.6 8.4 4.6c1.6 0 2.9.8 3.6 2.1.7-1.3 2-2.1 3.6-2.1 2.5 0 4.8 1.9 4.8 5C20.4 16 12 21.4 12 21.4z';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label="مسکات باگی"
      className={`relative select-none shrink-0 transition-transform ${isJumping ? 'animate-bounce' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible origin-bottom drop-shadow-[0_4px_0_rgba(42,26,74,0.15)]"
        aria-hidden="true"
      >
        {/* Left Wing */}
        <g className={`origin-bottom transition-transform duration-200 ${mood === 'joy' || mood === 'love' ? 'animate-pulse' : ''}`}>
          <ellipse
            cx="50"
            cy="106"
            rx="21"
            ry="34"
            transform="rotate(-18 50 106)"
            fill="#ffffff"
            fillOpacity=".9"
            stroke="#2a1a4a"
            strokeWidth="4"
          />
        </g>

        {/* Right Wing */}
        <g className={`origin-bottom transition-transform duration-200 ${mood === 'joy' || mood === 'love' ? 'animate-pulse' : ''}`}>
          <ellipse
            cx="150"
            cy="106"
            rx="21"
            ry="34"
            transform="rotate(18 150 106)"
            fill="#ffffff"
            fillOpacity=".9"
            stroke="#2a1a4a"
            strokeWidth="4"
          />
        </g>

        {/* Feet */}
        <ellipse cx="72" cy="176" rx="14" ry="9" fill="#2a1a4a" />
        <ellipse cx="128" cy="176" rx="14" ry="9" fill="#2a1a4a" />

        {/* Left Antenna */}
        <g className="origin-bottom animate-[wig_2s_ease-in-out_infinite]">
          <path d="M84 52Q70 28 56 20" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="55" cy="19" r="7" fill="#2a1a4a" />
        </g>

        {/* Right Antenna */}
        <g className="origin-bottom animate-[wig_2s_ease-in-out_infinite_reverse]">
          <path d="M116 52Q130 28 144 20" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="145" cy="19" r="7" fill="#2a1a4a" />
        </g>

        {/* Round Body */}
        <ellipse cx="100" cy="108" rx="74" ry="68" fill="#ff4d63" stroke="#2a1a4a" strokeWidth="5" />

        {/* Bug Spots */}
        <g fill="#2a1a4a">
          <circle cx="46" cy="100" r="10" />
          <circle cx="154" cy="100" r="10" />
          <circle cx="62" cy="150" r="8" />
          <circle cx="138" cy="150" r="8" />
        </g>

        {/* Body Highlight */}
        <path d="M50 80Q58 58 84 52" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".6" />

        {/* Cheeks */}
        <ellipse cx="66" cy="128" rx="12" ry="7" fill="#ff6fa5" opacity=".8" />
        <ellipse cx="134" cy="128" rx="12" ry="7" fill="#ff6fa5" opacity=".8" />

        {/* --- EYES --- */}
        {/* Normal / Silly / Sad Eyes */}
        {(mood === 'hi' || mood === 'silly' || mood === 'sad') && (
          <g className="origin-center animate-[blink_4s_infinite]">
            <ellipse cx="78" cy="108" rx="9.5" ry="12.5" fill="#2a1a4a" />
            <ellipse cx="122" cy="108" rx="9.5" ry="12.5" fill="#2a1a4a" />
            <circle cx="75" cy="103" r="3.6" fill="#fff" />
            <circle cx="119" cy="103" r="3.6" fill="#fff" />
            <circle cx="81" cy="113" r="1.8" fill="#fff" />
            <circle cx="125" cy="113" r="1.8" fill="#fff" />
          </g>
        )}

        {/* Joy Eyes (Curved upside down arcs) */}
        {mood === 'joy' && (
          <g fill="none" stroke="#2a1a4a" strokeWidth="5.5" strokeLinecap="round">
            <path d="M66 112Q78 96 90 112" />
            <path d="M110 112Q122 96 134 112" />
          </g>
        )}

        {/* Wow Eyes (Big surprised circles) */}
        {mood === 'wow' && (
          <g>
            <circle cx="78" cy="108" r="15" fill="#fff" stroke="#2a1a4a" strokeWidth="4.5" />
            <circle cx="122" cy="108" r="15" fill="#fff" stroke="#2a1a4a" strokeWidth="4.5" />
            <circle cx="78" cy="109" r="6" fill="#2a1a4a" />
            <circle cx="122" cy="109" r="6" fill="#2a1a4a" />
          </g>
        )}

        {/* Love Eyes (Heart eyes) */}
        {mood === 'love' && (
          <g>
            <g transform="translate(60 89) scale(1.5)">
              <path d={heartPath} fill="#ff6fa5" stroke="#2a1a4a" strokeWidth="1.6" strokeLinejoin="round" />
            </g>
            <g transform="translate(104 89) scale(1.5)">
              <path d={heartPath} fill="#ff6fa5" stroke="#2a1a4a" strokeWidth="1.6" strokeLinejoin="round" />
            </g>
          </g>
        )}

        {/* Shh Eyes (Curved relaxed eyes) */}
        {mood === 'shh' && (
          <g fill="none" stroke="#2a1a4a" strokeWidth="5.5" strokeLinecap="round">
            <path d="M66 108Q78 120 90 108" />
            <path d="M110 108Q122 120 134 108" />
          </g>
        )}

        {/* --- MOUTHS --- */}
        {/* Simple Smile */}
        {mood === 'hi' && (
          <path d="M86 128Q100 144 114 128" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
        )}

        {/* Joy Open Mouth */}
        {mood === 'joy' && (
          <g>
            <path d="M82 124Q100 160 118 124Z" fill="#7a1f3d" stroke="#2a1a4a" strokeWidth="4.5" strokeLinejoin="round" />
            <ellipse cx="100" cy="136" rx="9" ry="5" fill="#ff6fa5" />
          </g>
        )}

        {/* Wow "O" Mouth */}
        {mood === 'wow' && (
          <ellipse cx="100" cy="136" rx="8" ry="10" fill="#7a1f3d" stroke="#2a1a4a" strokeWidth="4.5" />
        )}

        {/* Shh Mouth */}
        {mood === 'shh' && (
          <ellipse cx="100" cy="136" rx="5" ry="6" fill="#7a1f3d" stroke="#2a1a4a" strokeWidth="4" />
        )}

        {/* Sad Frown */}
        {mood === 'sad' && (
          <path d="M86 142Q100 126 114 142" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
        )}

        {/* Silly Tongue Out */}
        {mood === 'silly' && (
          <g>
            <path d="M86 128Q100 144 114 128" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
            <path d="M95 137Q100 158 107 137Z" fill="#ff6fa5" stroke="#2a1a4a" strokeWidth="3.5" strokeLinejoin="round" />
          </g>
        )}

        {/* Love Smile */}
        {mood === 'love' && (
          <path d="M86 128Q100 144 114 128" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
        )}

        {/* Shh Finger to mouth */}
        {mood === 'shh' && (
          <g>
            <path d="M152 160Q132 160 104 146" fill="none" stroke="#2a1a4a" strokeWidth="9" strokeLinecap="round" />
            <rect x="95" y="114" width="10" height="34" rx="5" fill="#2a1a4a" />
          </g>
        )}

        {/* Sad Tear */}
        {mood === 'sad' && (
          <path
            d="M66 120Q60 132 66 138Q72 132 66 120Z"
            fill="#5cc8ff"
            stroke="#2a1a4a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}

        {/* Party Hat */}
        <g className="origin-[100px_58px] -rotate-6">
          <path
            d="M100 12L76 60Q100 68 124 60Z"
            fill="#ffd84a"
            stroke="#2a1a4a"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path d="M91 34L110 41M84 48L117 55" stroke="#ff6fa5" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="11" r="7" fill="#ff6fa5" stroke="#2a1a4a" strokeWidth="3.5" />
        </g>
      </svg>
    </div>
  );
};
