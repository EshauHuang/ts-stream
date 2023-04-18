import drawPicture from "@/utils/drawPicture";


export default function (file: File, callback: (blob: Blob) => void) {
  const fileReader = new FileReader();

  fileReader.addEventListener("load", () => {
    const { result } = fileReader;

    if (!result) return;

    if (typeof result === "string") {
      const img = new Image();
      img.onload = async function () {
        const blob = await drawPicture({
          img,
        });

        if (blob) {
          callback(blob)
        }
      };
      img.src = result;
    }
  });

  fileReader.readAsDataURL(file);
}