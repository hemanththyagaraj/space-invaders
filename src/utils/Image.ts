/**
 * Asynchronously loads an image and resolves when the image is successfully loaded
 * @param {string} src: string
 * @returns {Promise<void>} - A promise that resolves when the image is loaded successfully and rejects if an error occurs during loading
 */
export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject("Failed to load image"));
  });
};
