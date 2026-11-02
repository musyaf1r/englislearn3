export default function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div className="absolute -top-36 -right-24 size-96 rounded-full bg-[#f2d89e]/35 blur-3xl" />
      <div className="absolute top-24 -left-36 size-80 rounded-full bg-[#c4e6e5]/35 blur-3xl" />
      <svg
        className="absolute bottom-0 left-0 h-32 w-full opacity-60"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0 116c180-48 300 44 480 0s300-44 480 0 300 32 480-8v92H0z"
          fill="#d2e8e9"
        />
        <path
          d="M0 156c160-34 320 24 480 0s320-24 480 0 320 28 480-8v52H0z"
          fill="#c1dfe2"
        />
      </svg>
    </div>
  );
}
