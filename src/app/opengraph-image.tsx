import { ImageResponse } from "next/og";

export const alt = "Prixo — Tu idioma, un paso a la vez.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "#0a0d13",
          backgroundImage:
            "radial-gradient(60% 100% at 15% 20%, rgba(91,79,232,0.28), transparent), radial-gradient(50% 90% at 90% 90%, rgba(255,94,168,0.22), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 48 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5b4fe8, #ff5ea8 50%, #c6ff5c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#0a0d13" }} />
          </div>
          <div style={{ color: "#eef1f6", fontSize: 40, fontWeight: 700 }}>Prixo</div>
        </div>
        <div
          style={{
            color: "#eef1f6",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: 900,
          }}
        >
          Tu idioma, un paso a la vez.
        </div>
        <div style={{ color: "#97a2b8", fontSize: 30, marginTop: 28, maxWidth: 780 }}>
          Un tutor de IA que se prepara para tu viaje, tu negociación o tu entrevista real.
        </div>
      </div>
    ),
    { ...size }
  );
}
