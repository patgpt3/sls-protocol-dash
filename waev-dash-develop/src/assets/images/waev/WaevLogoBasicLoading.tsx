'use client';
interface Props {
  width?: string | number;
  height?: string | number;
}

export const WaevLogoBasicLoading = ({ width = '220', height = '60' }: Props): JSX.Element => {
  // Animate a shimmer over the SLS wordmark
  return (
    <svg width={width} height={height} viewBox="0 0 480 120" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0B1220' }}>
      <defs>
        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8">
            <animate attributeName="offset" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Static SLS mark */}
      <g fill="none" stroke="#3FA9F5" strokeWidth="6">
        <path d="M60 10c22 12 44 16 64 18v32c0 36-28 58-64 70C24 118-4 96-4 60V28C16 26 38 22 60 10z" transform="translate(8,8)" />
        <ellipse cx="68" cy="44" rx="30" ry="12" />
        <rect x="38" y="44" width="60" height="34" rx="6" />
        <ellipse cx="68" cy="78" rx="30" ry="12" />
      </g>
      <g fill="#FFFFFF" fontFamily="sans-serif" fontWeight="700">
        <text x="150" y="55" fontSize="64">SLS</text>
        <text x="152" y="92" fontSize="22" letterSpacing="1">STORAGE LAYER</text>
        <text x="152" y="116" fontSize="22" letterSpacing="1">SECURITY</text>
      </g>
      {/* Shimmer overlay */}
      <rect x="140" y="20" width="300" height="90" fill="url(#shimmer)" />
    </svg>
  );
};
