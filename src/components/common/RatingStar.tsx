import { useId } from "react";

const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(v, max));

type Props = {
    value?: number;
    size?: number;
};

export default function RatingStar({ value = 0, size = 56 }: Props) {
    const id = useId();
    const percentage = clamp((value / 10) * 100, 0, 100);
    const glowStrength = 2 + percentage / 15;

    return (
        <div
            style={{
                display: "inline-block",
                transition: "transform 0.2s ease",
            }}
            className="hover:scale-110"
        >
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                style={{
                    display: "block",
                    filter: `drop-shadow(0 0 ${glowStrength}px rgba(99,102,241,0.45))`,
                    transition: "filter 0.4s ease",
                }}
            >
                <defs>
                    {/* 🩶 Silver base */}
                    <linearGradient id={`base-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e5e7eb" />
                        <stop offset="50%" stopColor="#d1d5db" />
                        <stop offset="100%" stopColor="#9ca3af" />
                    </linearGradient>
                    <linearGradient id={`fill-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="oklch(51.1% 0.262 276.966)" />
                        <stop offset="100%" stopColor="oklch(51.1% 0.262 276.966)" />
                    </linearGradient>
                    <radialGradient id={`shine-${id}`} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                        <stop offset="40%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id={`clip-${id}`}>
                        <rect x="0" y="0" width={`${percentage}%`} height="100%" />
                    </clipPath>
                </defs>
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill={`url(#base-${id})`}
                />
                <g clipPath={`url(#clip-${id})`}>
                    <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        fill={`url(#fill-${id})`}
                        style={{
                            transition: "all 0.5s ease",
                        }}
                    />
                    <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        fill={`url(#shine-${id})`}
                        style={{ mixBlendMode: "screen" }}
                    />
                </g>
            </svg>
        </div>
    );
}
