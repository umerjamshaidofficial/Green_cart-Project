// This helper automatically finds the right image in your assets folder
export const getProductImage = (name, type) => {
  try {
    // This assumes your images are in src/assets/images/
    return new URL(`../assets/images/${name}.${type}`, import.meta.url).href;
  } catch {
    console.error("Image not found:", name);
    return ""; // Fallback to empty string or a placeholder
  }
};