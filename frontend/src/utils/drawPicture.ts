export default async function ({ canvasWidth, canvasHeight, img }: { canvasWidth?: number, canvasHeight?: number, img: HTMLImageElement }): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth || 1280;
  canvas.height = canvasHeight || 720;

  const ctx = canvas.getContext("2d");

  const imgWidth = img.width;
  const imgHeight = img.height;
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvas.width / canvas.height;

  let drawWidth;
  let drawHeight;
  let x;
  let y;

  /* 
  圖片的寬度比設定的寬度長，canvasWidth(drawWidth) / imgWidth = canvasHeight(drawHeight) / imgHeight => canvasHeight(drawHeight) = canvasWidth * imgHeight / imgWidth => drawHeight 會比設定的長度短
  */
  if (imgRatio > canvasRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
    x = 0;
    y = (canvas.height - drawHeight) / 2;
  } else {
    drawWidth = canvas.height * imgRatio;
    drawHeight = canvas.height;
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  }

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        }
      },
      "image/jpeg",
      1
    );
  })
}