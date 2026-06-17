export function addButton(scene, x, y, label, onClick, width = 260) {
  const bg = scene.add.rectangle(x, y, width, 48, 0x2563eb).setStrokeStyle(2, 0x93c5fd).setInteractive({ useHandCursor: true });
  const text = scene.add.text(x, y, label, { fontFamily: "Arial", fontSize: "20px", color: "#fff" }).setOrigin(0.5);
  bg.on("pointerover", () => bg.setFillStyle(0x1d4ed8));
  bg.on("pointerout", () => bg.setFillStyle(0x2563eb));
  bg.on("pointerdown", onClick);
  return { bg, text };
}
export function addPanel(scene, x, y, width, height, color = 0x1f2937) {
  return scene.add.rectangle(x, y, width, height, color, 0.95).setStrokeStyle(2, 0x60a5fa);
}
export function addHeader(scene, state) {
  scene.add.rectangle(512, 32, 1024, 64, 0x0f172a);
  scene.add.text(24, 18, "IncluC0de", { fontFamily: "Arial", fontSize: "24px", color: "#93c5fd", fontStyle: "bold" });
  scene.add.text(760, 14, `Nível ${state.level}`, { fontFamily: "Arial", fontSize: "18px", color: "#fff" });
  scene.add.text(760, 38, `XP: ${state.xp}  |  Bits: ${state.coins}`, { fontFamily: "Arial", fontSize: "16px", color: "#fde68a" });
}
export function wrapText(text, maxChars = 80) {
  if (!text) return "";
  const words = text.split(" "), lines = [];
  let line = "";
  for (const word of words) {
    if ((line + word).length > maxChars) { lines.push(line.trim()); line = ""; }
    line += word + " ";
  }
  if (line.trim()) lines.push(line.trim());
  return lines.join("\n");
}
