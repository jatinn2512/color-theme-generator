# 🎨 Color Theme Generator

A beautiful and intuitive React application that extracts color palettes from your images. Upload any image and instantly generate harmonious color schemes for your design projects.

## ✨ Features

- **Image Upload**: Simply upload any image to extract its dominant colors
- **Customizable Palette**: Choose how many colors to extract (2-10 colors)
- **Color Harmonies**: Generate beautiful color schemes using:
  - **Analogous** - Colors next to each other on the color wheel
  - **Complementary** - Opposite colors for high contrast
  - **Triadic** - Three evenly spaced colors
  - **Monochrome** - Different shades of a single color
- **Copy & Export**:
  - Copy individual colors with one click
  - Export as CSS variables
  - Download palette as JSON file
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
  ```bash
  git clone https://github.com/jatinn2512/color-theme-generator
  cd color-theme-generator
  ```
2. **Install dependencies**

````bash
npm install
````

3. **Start the development server**

```bash
npm run dev
```
Open your browser
Navigate to http://localhost:5173 (or the port shown in your terminal)

## 🛠️ Built With
- React - Frontend framework
- TypeScript - Type safety
- HTML5 Canvas - Image processing and color extraction
- CSS-in-JS - Styling

## 📦 Project Structure
```bash
src/
├── components/
│   └── PaletteGenerator.tsx    # Main color generator component
├── utils/
│   └── colorUtils.ts          # Color conversion utilities
├── App.tsx                    # Root component
└── main.tsx                  # Application entry point
```
## 🎯 How to Use
1. Upload Image: Click "Upload Image" and select any image file

2. Adjust Colors: Use the +/- buttons to choose how many colors to extract

3. Copy Colors: Click on any color swatch to copy its hex code

4. Generate Harmonies: Click any harmony button to create new color schemes

5. Export: Use "Copy CSS Variables" or "Download JSON" to save your palette

### 🔧 Color Utilities
The app includes powerful color conversion functions:

toHex(r, g, b) - Convert RGB to HEX

rgbToHsl(r, g, b) - Convert RGB to HSL

hslToRgb(h, s, l) - Convert HSL to RGB

hexToRgb(hex) - Convert HEX to RGB

### 🎨 Color Harmony Types
*Analogous* : Colors adjacent on the color wheel (creates harmonious schemes)

*Complementary* : Opposite colors (creates vibrant contrast)

*Triadic* : Three evenly spaced colors (balanced and vibrant)

*Monochrome* : Different shades of one color (elegant and cohesive)

### 📱 Browser Support
Chrome (recommended)

Firefox

Safari

Edge

## 📄 License
MIT License

