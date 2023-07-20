import oceanMask from "../assets/mask.webp";

const canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 512;
const context = canvas.getContext("2d");

export function loadEarthMask() {
  return new Promise<void>((resolve) => {
    const mapImage = new Image();
    mapImage.onload = () => {
      resolve();
      context?.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };
    mapImage.src = oceanMask;
  });
}

const alphaThreshold = 50;

export function visibilityForCoordinate(longitude: number, latitude: number) {
  const pixelX = ((longitude + 180) / 360) * canvas.width;
  const pixelY = ((90 - latitude) / 180) * canvas.height;

  const imageData = context?.getImageData(pixelX, pixelY, 1, 1);
  const pixelData = imageData?.data;

  return !!pixelData && pixelData[3] < alphaThreshold;
}
