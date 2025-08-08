'use client';
interface Props {
  width?: string | number;
  height?: string | number;
}

export const WaevLogoBasic = ({ width = '220', height = '60' }: Props): JSX.Element => {
  // Render SLS logo (shield + DB lock) with SLS wordmark
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 480 120"
      style={{ background: '#0B1220' }}
    >
      <g fill="none" fillRule="evenodd">
        {/* Shield */}
        <path
          d="M60 10c22 12 44 16 64 18v32c0 36-28 58-64 70C24 118-4 96-4 60V28C16 26 38 22 60 10z"
          transform="translate(8,8)"
          fill="#0B1220"
          stroke="#FFFFFF"
          strokeWidth="6"
        />
        {/* DB cylinder */}
        <ellipse cx="68" cy="44" rx="30" ry="12" fill="#0B1220" stroke="#FFFFFF" strokeWidth="6" />
        <rect x="38" y="44" width="60" height="34" rx="6" fill="#0B1220" stroke="#FFFFFF" strokeWidth="6" />
        <ellipse cx="68" cy="78" rx="30" ry="12" fill="#0B1220" stroke="#FFFFFF" strokeWidth="6" />
        {/* Lock */}
        <rect x="58" y="50" width="20" height="18" rx="3" fill="#FFFFFF" />
        <path d="M63 50v-6c0-6 5-11 11-11s11 5 11 11v6" fill="none" stroke="#FFFFFF" strokeWidth="6" />

        {/* Wordmark */}
        <g fill="#FFFFFF" fontFamily="sans-serif" fontWeight="700">
          <text x="150" y="55" fontSize="64">SLS</text>
          <text x="152" y="92" fontSize="22" letterSpacing="1">STORAGE LAYER</text>
          <text x="152" y="116" fontSize="22" letterSpacing="1">SECURITY</text>
        </g>
      </g>
    </svg>
  );
};
