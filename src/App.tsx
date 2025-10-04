import PaletteGenerator from "./components/PaletteGenerator";

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {/* <h1 style={{ textAlign: "center" }}>Color Theme Generator</h1> */}
      <PaletteGenerator />
    </div>
  );
}