import { useRef, useState } from "react";
import { toHex, rgbToHsl, hslToRgb } from "../utils/colorUtils";

const buttonStyle: React.CSSProperties = {
  background: "#4f8cff",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "16px 28px",
  margin: "0 12px 12px 0",
  fontWeight: 600,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.2s ease",
  fontFamily: "'Segoe UI', Arial, sans-serif",
};

export default function PaletteGenerator() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [swatches, setSwatches] = useState<string[]>([]);
  const [numColors, setNumColors] = useState<number>(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = 300;
      const H = Math.round((img.height * 300) / img.width);
      canvas.width = W;
      canvas.height = H;

      ctx.drawImage(img, 0, 0, W, H);
      const imageData = ctx.getImageData(0, 0, W, H);
      const data = imageData.data;

      const freq: Record<string, number> = {};
      const step = 4;

      for (let i = 0; i < data.length; i += 4 * step) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Quantize colors to reduce noise
        r = Math.round(r / 32) * 32;
        g = Math.round(g / 32) * 32;
        b = Math.round(b / 32) * 32;

        const key = `${r},${g},${b}`;
        freq[key] = (freq[key] || 0) + 1;
      }

      // Sort by frequency and pick top N
      const sorted = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(([rgb]) => {
          const [r, g, b] = rgb.split(",").map(Number);
          return toHex(r, g, b);
        });

      setSwatches(sorted);
      setIsProcessing(false);
    };

    img.onerror = () => {
      setIsProcessing(false);
      alert("Error loading image");
    };

    img.src = URL.createObjectURL(file);
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  };

  const generateHarmonies = (
    baseColor: string,
    type: "analogous" | "complementary" | "triadic" | "monochrome"
  ): string[] => {
    // Convert hex to RGB first
    const [r, g, b] = hexToRgb(baseColor);

    // Convert to HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    let harmonies: number[][] = [];

    switch (type) {
      case "analogous":
        harmonies = [
          [(h + 330) % 360, s, l], // -30°
          [h, s, l], // base
          [(h + 30) % 360, s, l], // +30°
          [(h + 15) % 360, s, l], // +15°
          [(h + 345) % 360, s, l], // -15°
        ];
        break;
      case "complementary":
        harmonies = [
          [h, s, l],
          [(h + 180) % 360, s, l],
          [h, s, Math.max(20, l - 20)],
          [(h + 180) % 360, s, Math.min(80, l + 20)],
          [h, Math.max(30, s - 20), l],
        ];
        break;
      case "triadic":
        harmonies = [
          [h, s, l],
          [(h + 120) % 360, s, l],
          [(h + 240) % 360, s, l],
          [h, s, Math.max(20, l - 15)],
          [(h + 120) % 360, Math.max(30, s - 10), l],
        ];
        break;
      case "monochrome":
        harmonies = [
          [h, s, Math.max(15, l - 30)],
          [h, s, Math.max(25, l - 15)],
          [h, s, l],
          [h, s, Math.min(85, l + 15)],
          [h, s, Math.min(95, l + 30)],
        ];
        break;
    }

    // Convert back to hex
    return harmonies.map(([h, s, l]) => {
      const [r, g, b] = hslToRgb(h, s, l);
      return toHex(r, g, b);
    });
  };

  const clearPalette = () => {
    setSwatches([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const incrementColors = () => {
    if (numColors < 10) setNumColors(numColors + 1);
  };

  const decrementColors = () => {
    if (numColors > 2) setNumColors(numColors - 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        padding: "30px",
        margin: 0,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        background: "linear-gradient(180deg, #4f8cff 0%, #f0f6ff 100%)",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          margin: "0 0 60px 0",
          padding: "60px 40px",
          background: "#4f8cff",
          borderRadius: "20px",
          boxShadow: "0 12px 40px rgba(79,140,255,0.4)",
          width: "100%",
          maxWidth: "800px",
          border: "3px solid white",
        }}
      >
        <h1
          style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            color: "white",
            margin: 0,
            letterSpacing: "1.2px",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            lineHeight: "1.1",
            marginBottom: "16px",
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          Color Theme Generator
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            color: "rgba(255,255,255,0.95)",
            margin: 0,
            fontWeight: 500,
            letterSpacing: "0.6px",
            textShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          Extract beautiful color palettes from your images
        </p>
      </div>

      <div
        style={{
          maxWidth: 1000,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Main Content Row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 40,
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Left Panel - Controls */}
          <div
            style={{
              minWidth: 320,
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                color: "#2d3748",
                fontWeight: 600,
                fontSize: 22,
                textAlign: "center",
              }}
            >
              Upload Image
            </h3>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{
                padding: 16,
                borderRadius: 12,
                border: "2px solid #b0bec5",
                background: "#f8fafc",
                marginBottom: 24,
                width: "100%",
                fontSize: 16,
                fontWeight: 500,
                color: "#2d3748",
                outline: "none",
                transition: "border 0.2s",
              }}
            />

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <label
                style={{
                  fontWeight: 600,
                  color: "#2d3748",
                  fontSize: 18,
                }}
              >
                Number of Colors
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "8px 12px",
                }}
              >
                <button
                  onClick={decrementColors}
                  disabled={numColors <= 2}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "2px solid #4f8cff",
                    background: "#fff",
                    color: "#4f8cff",
                    fontSize: 18,
                    fontWeight: "bold",
                    cursor: numColors > 2 ? "pointer" : "not-allowed",
                    opacity: numColors > 2 ? 1 : 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  -
                </button>

                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#2d3748",
                    minWidth: 30,
                    textAlign: "center",
                    margin: "0 8px",
                  }}
                >
                  {numColors}
                </span>

                <button
                  onClick={incrementColors}
                  disabled={numColors >= 10}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "2px solid #4f8cff",
                    background: "#fff",
                    color: "#4f8cff",
                    fontSize: 18,
                    fontWeight: "bold",
                    cursor: numColors < 10 ? "pointer" : "not-allowed",
                    opacity: numColors < 10 ? 1 : 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {isProcessing && (
              <div
                style={{
                  color: "#4f8cff",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Processing image...
              </div>
            )}

            {swatches.length > 0 && (
              <button
                onClick={clearPalette}
                style={{
                  background: "#ff6b6b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  width: "100%",
                  marginTop: 16,
                  transition: "all 0.2s",
                }}
              >
                Clear Palette
              </button>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* Right Panel - Swatches */}
          <div
            style={{
              flex: 1,
              minWidth: 400,
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                color: "#2d3748",
                fontWeight: 600,
                fontSize: 22,
              }}
            >
              Color Palette
            </h3>

            {swatches.length === 0 ? (
              <div
                style={{
                  color: "#666",
                  fontSize: 18,
                  textAlign: "center",
                  marginTop: 40,
                  fontWeight: 500,
                }}
              >
                Upload an image to generate color palette
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {swatches.map((s, i) => (
                  <div
                    key={s}
                    style={{
                      width: 100,
                      height: 100,
                      background: s,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      color: "#fff",
                      cursor: "pointer",
                      borderRadius: 16,
                      boxShadow:
                        hovered === i
                          ? "0 6px 24px rgba(0,0,0,0.20)"
                          : "0 4px 16px rgba(0,0,0,0.12)",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      transform: hovered === i ? "scale(1.08)" : "scale(1)",
                      position: "relative",
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      navigator.clipboard.writeText(s);
                      alert(`Copied ${s} to clipboard!`);
                    }}
                    title="Click to copy color"
                  >
                    <div
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 12,
                        letterSpacing: 0.5,
                        fontFamily: "monospace",
                      }}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Harmony Options */}
        {swatches.length > 0 && (
          <div
            style={{
              width: "100%",
              maxWidth: 800,
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: 32,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                color: "#2d3748",
                fontWeight: 600,
                fontSize: 22,
              }}
            >
              Color Harmonies
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Analogous", color: "#4f8cff" },
                { label: "Complementary", color: "#6ee7b7" },
                { label: "Triadic", color: "#b388ff" },
                { label: "Monochrome", color: "#ffb347" },
              ].map((item, idx) => (
                <button
                  key={item.label}
                  style={{
                    background: item.color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "16px 24px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                    minWidth: 140,
                  }}
                  onClick={() => {
                    if (swatches[0]) {
                      const newColors = generateHarmonies(
                        swatches[0],
                        item.label.toLowerCase() as "analogous" | "complementary" | "triadic" | "monochrome"
                      );
                      setSwatches(newColors);
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 16,
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  background: "#ffb347",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "16px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.2s ease",
                  minWidth: 160,
                }}
                onClick={() => {
                  const css = swatches
                    .map((c, i) => `--color-${i + 1}: ${c};`)
                    .join("\n");
                  navigator.clipboard.writeText(css);
                  alert("CSS variables copied to clipboard!");
                }}
              >
                Copy CSS Variables
              </button>

              <button
                style={{
                  background: "#b388ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "16px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.2s ease",
                  minWidth: 160,
                }}
                onClick={() => {
                  const blob = new Blob([JSON.stringify(swatches, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "color-palette.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
