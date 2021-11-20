import Jimp from "jimp";
import numeral from "numeral";

testImages(1);

async function testImages(total) {
  const allImages = [];
  for (let i = 0; i < total; i++) {
    const num = numeral(i).format("000");
    const img = await Jimp.read(`data/square${num}.png`);

    let rawData = [];
    for (let n = 0; n < 28 * 28; n++) {
      let index = n * 4;
      let r = img.bitmap.data[index + 0];
      // let g = img.bitmap.data[n + 1];
      // let b = img.bitmap.data[n + 2];
      rawData[n] = r / 255.0;
    }
    const buffer = [];
    for (let n = 0; n < img.length; n++) {
      const val = Math.floor(rawData[n] * 255);
      buffer[n * 4 + 0] = val;
      buffer[n * 4 + 1] = val;
      buffer[n * 4 + 2] = val;
      buffer[n * 4 + 3] = 255;
    }
    const image = new Jimp(
      {
        data: Buffer.from(buffer),
        width: 28,
        height: 28,
      },
      (err, image) => {
        const num = numeral(i).format("000");
        image.write(`output/square${num}.png`);
      }
    );
  }
}
