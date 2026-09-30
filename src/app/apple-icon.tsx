import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icône d'écran d'accueil (iOS) : même colis que le logo de l'en-tête.
export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fafafa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
          <path d="M12 22V12" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <path d="m7.5 4.27 9 5.15" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
