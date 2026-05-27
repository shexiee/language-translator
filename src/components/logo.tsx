export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl shadow-cozy"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, #f4e4cc 0%, #e89968 55%, #d97742 100%)",
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        width={size * 0.6}
        height={size * 0.6}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 22h14M9 22c0 3 3 5 7 5s7-2 7-5M9 22V11a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v11"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 12h2.5a2.5 2.5 0 0 1 0 5H23"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13 13c0 1 1 1.5 2 1.5M19 13c0 1-1 1.5-2 1.5M16 17c-1.2 0-2-.6-2-1"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M11 5c-1 1-1 2 0 3M21 5c1 1 1 2 0 3"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
