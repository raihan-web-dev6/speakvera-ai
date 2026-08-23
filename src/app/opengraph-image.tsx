import {
  ImageResponse,
} from "next/og";

export const alt =
  "Speakvera AI — AI English Speaking Coach";

export const size = {
  width:
    1200,

  height:
    630,
};

export const contentType =
  "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:
            "100%",

          height:
            "100%",

          display:
            "flex",

          position:
            "relative",

          overflow:
            "hidden",

          background:
            "linear-gradient(135deg, #eef1ff 0%, #ffffff 60%, #eef1ff 100%)",

          color:
            "#171342",

          padding:
            "70px",
        }}
      >
        <div
          style={{
            position:
              "absolute",

            width:
              "420px",

            height:
              "420px",

            borderRadius:
              "9999px",

            background:
              "rgba(37, 99, 235, 0.12)",

            filter:
              "blur(70px)",

            right:
              "-80px",

            top:
              "-90px",
          }}
        />

        <div
          style={{
            display:
              "flex",

            width:
              "100%",

            flexDirection:
              "column",

            justifyContent:
              "space-between",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "16px",
            }}
          >
            <div
              style={{
                width:
                  "60px",

                height:
                  "60px",

                borderRadius:
                  "17px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "#17135f",

                color:
                  "#ffffff",

                fontSize:
                  "30px",
              }}
            >
              🎙
            </div>

            <div
              style={{
                display:
                  "flex",

                fontSize:
                  "32px",

                fontWeight:
                  700,
              }}
            >
              Speakvera
              <span
                style={{
                  color:
                    "#2563eb",

                  marginLeft:
                    "9px",
                }}
              >
                AI
              </span>
            </div>
          </div>

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              maxWidth:
                "950px",
            }}
          >
            <div
              style={{
                color:
                  "#2563eb",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                letterSpacing:
                  "2px",

                textTransform:
                  "uppercase",
              }}
            >
              AI English Speaking Coach
            </div>

            <div
              style={{
                display:
                  "flex",

                flexDirection:
                  "column",

                marginTop:
                  "20px",

                fontSize:
                  "66px",

                lineHeight:
                  1.05,

                fontWeight:
                  800,

                letterSpacing:
                  "-2px",
              }}
            >
              Speak English.
              <span
                style={{
                  color:
                    "#2563eb",
                }}
              >
                Get instant AI feedback.
              </span>
            </div>

            <div
              style={{
                marginTop:
                  "25px",

                color:
                  "#475569",

                fontSize:
                  "25px",
              }}
            >
              Practice. Improve. Speak with confidence.
            </div>
          </div>
        </div>
      </div>
    ),

    {
      ...size,
    }
  );
}