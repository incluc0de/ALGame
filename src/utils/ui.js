export function wrapText(text, maxLength = 80) {
  if (!text) return "";

  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + word + " ";

    if (testLine.length > maxLength) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  });

  lines.push(currentLine);

  return lines.join("\n");
}

export function addPanel(scene, x, y, width, height) {
  return scene.add
    .rectangle(x, y, width, height, 0x0f172a, 0.92)
    .setStrokeStyle(2, 0x38bdf8);
}

export function addHeader(scene, state) {
  return scene.add.text(
    20,
    20,
    `Nível ${state.level} | XP ${state.xp}`,
    {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffffff"
    }
  );
}

export function addButton(
  scene,
  x,
  y,
  label,
  callback,
  width = 240
) {
  const container = scene.add.container(x, y);

  const bg = scene.add
    .rectangle(0, 0, width, 50, 0x2563eb)
    .setStrokeStyle(2, 0x60a5fa)
    .setInteractive({ useHandCursor: true });

  const text = scene.add.text(0, 0, label, {
    fontFamily: "Arial",
    fontSize: "18px",
    color: "#ffffff"
  }).setOrigin(0.5);

  bg.on("pointerover", () => {
    bg.setFillStyle(0x3b82f6);
  });

  bg.on("pointerout", () => {
    bg.setFillStyle(0x2563eb);
  });

  bg.on("pointerdown", callback);

  container.add([bg, text]);

  container.bg = bg;
  container.label = text;

  return container;
}

export function setButtonEnabled(button, enabled = true) {
  if (!button) return;

  if (enabled) {
    button.bg.setInteractive({ useHandCursor: true });
    button.bg.setAlpha(1);
    button.label.setAlpha(1);
  } else {
    button.bg.disableInteractive();
    button.bg.setAlpha(0.4);
    button.label.setAlpha(0.4);
  }
}

export function showProcessingOverlay(
  scene,
  message = "Processando..."
) {
  hideProcessingOverlay(scene);

  const W = scene.scale.width;
  const H = scene.scale.height;

  const container = scene.add.container(
    W / 2,
    H / 2
  );

  const bg = scene.add
    .rectangle(
      0,
      0,
      620,
      180,
      0x0f172a,
      0.96
    )
    .setStrokeStyle(2, 0x38bdf8);

  const title = scene.add.text(
    0,
    -25,
    message,
    {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#ffffff",
      fontStyle: "bold"
    }
  ).setOrigin(0.5);

  const subtitle = scene.add.text(
    0,
    25,
    "Aguarde um instante...",
    {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#fde68a"
    }
  ).setOrigin(0.5);

  container.add([
    bg,
    title,
    subtitle
  ]);

  container.setDepth(9999);

  scene.processingOverlay = container;

  return container;
}

export function hideProcessingOverlay(scene) {
  if (scene.processingOverlay) {
    scene.processingOverlay.destroy();
    scene.processingOverlay = null;
  }
}

export function showToast(
  scene,
  message,
  color = "#ffffff"
) {
  if (scene.toastMessage) {
    scene.toastMessage.destroy();
  }

  scene.toastMessage = scene.add.text(
    scene.scale.width / 2,
    scene.scale.height - 40,
    message,
    {
      fontFamily: "Arial",
      fontSize: "18px",
      color,
      backgroundColor: "#0f172a",
      padding: {
        x: 12,
        y: 8
      }
    }
  )
  .setOrigin(0.5)
  .setDepth(9999);

  scene.time.delayedCall(3000, () => {
    if (scene.toastMessage) {
      scene.toastMessage.destroy();
      scene.toastMessage = null;
    }
  });
}