import { Model } from './model.js'
import { MnistDataSource } from './mnistDataSource.js'
import { ImageTransformer } from './ImageTransformer.js'
import { RandomDataSource } from './randomDataSource.js'
import { ArbitraryImageDataSource } from './arbitraryImageDataSource.js'

main()

async function main() {
    // Instantiate the model
    const model = new Model()

    // Instantiate a data source
    const dataSource = new MnistDataSource()
    // const dataSource = new RandomDataSource()
    // const dataSource = new ArbitraryImageDataSource()

    // Instatiate the Image transformer
    const transformer = new ImageTransformer()

    // Check if there is a pretrained model. If it exists load it, or train the model
    if (model.pretrainedModelExists()) {
        await model.load()
    } else {
        // Create the layers
        model.configure()
        // and train
        await model.train(await dataSource.getTrainingData(), 200)
    }
    // Test the model with testing data from the data source
    const testData = await dataSource.getTestData()
    const autoEncodedImages = model.autoencode(testData)

    // save the images to disk
    transformer.toImages(testData.arraySync(), 'org')
    transformer.toImages(autoEncodedImages.arraySync())
}
