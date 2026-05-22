export function EvGoldLogo() {
        return (
<svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_10px_rgba(212,175,55,0.3)]"
>
    {/* Outer circle */}
    <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            fill="url(#bgGradient)"
    />

    {/* EV text */}
    <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="28"
            fontWeight="600"
            fill="url(#goldGradient)"
            fontFamily="sans-serif"
    >
        EV
    </text>

    {/* Lightning bolt */}
    <path
            d="M52 30 L45 52 H55 L48 72"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
    />

    <defs>
        {/* Gold gradient */}
        <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#f7d774" />
            <stop offset="50%" stopColor="#d4a637" />
            <stop offset="100%" stopColor="#8a6218" />
        </linearGradient>

        {/* Dark inner background */}
        <radialGradient id="bgGradient">
            <stop offset="0%" stopColor="#111111" />
            <stop offset="100%" stopColor="#000000" />
        </radialGradient>
    </defs>
</svg>
        )
        }