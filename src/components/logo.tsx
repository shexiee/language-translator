import Image from "next/image";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-cozy"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src="/web-app-manifest-512x512.png"
        alt="Vocumi"
        width={size}
        height={size}
        priority
        className="h-full w-full object-cover"
      />
    </div>
  );
}
