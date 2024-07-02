const sharp = require("sharp");

async function base64Encode(url) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();

      const resizedBuffer = await sharp(arrayBuffer)
        .resize({ width: 600 })
        .toBuffer();

      const base64 = Buffer.from(resizedBuffer).toString("base64");
      return base64;
    } else {
      throw new Error(
        `Failed to fetch the image. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
