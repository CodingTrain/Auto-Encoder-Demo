import Jimp from 'jimp'

/**
 * Converts pixel arrays to real images which can be saved to disk
 */
export class ImageTransformer {
    saveImage(img, width = 28, height = 28, path) {
        new Jimp({ width, height, data: Buffer.from(img) }, (_, img) => img.write(path))
    }

    toImages(data, filePrefix = 'processed', width = 28, height = 28) {
        const imgs = data.map(img => img.flatMap(val => [val * 255, val * 255, val * 255, 255]))
        imgs.forEach((img, i) => this.saveImage(img, width, height, `output/${filePrefix}_${i}.png`))
    }
}