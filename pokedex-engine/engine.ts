import weaviate from 'weaviate-ts-client'
import { readFileSync, readdirSync, writeFileSync} from "fs"

const { removeBackground } = require('@imgly/background-removal-node');

export const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

async function createSchema () {
    const schemaConfig = {
        'class': 'Pokemon',
        'vectorizer': "img2vec-neural",
        'vectorIndexType': 'hnsw',
        'moduleConfig': {
            'img2vec-neural': {
                'imageFields': [
                    'image'
                ]
            }
        },
        'properties': [
            {
                'name': 'image',
                'dataType': ['blob']
            },
            {
                'name': 'text',
                'dataType': ['string']
            }
        ]
    }

    await client.schema
        .classCreator()
        .withClass(schemaConfig)
        .do();
}

async function deleteSchema () {
    await client.schema
        .classDeleter()
        .withClassName("Pokemon")
        .do();
}

async function removeImageBackground(imgSource: string): Promise<string> {
    const blob = await removeBackground(imgSource);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return buffer.toString("base64");
}

/*
Images must first be converted to base64. Once converted,
store it to the cooresponding class in the schema. Weaviate
will automatically use the neural network in the background
to vectorize it and update the embedding.
*/
async function trainAllPokedex() {
    const imgs = readdirSync('./img');
    console.log('Training pokedex with images...');

    const maxConcurrent = 5;
    let index = 0;

    async function processNextBatch() {
        if (index >= imgs.length) return;

        const batch = imgs.slice(index, index + maxConcurrent);
        index += maxConcurrent;

        const promises = batch.map(async (img) => {
            const b64 = Buffer.from(readFileSync(`./img/${img}`)).toString('base64')
            const name = img.split('.')[0].split('_').join(' ');
            console.log(`Storing ${name}...`);
            await client.data.creator().withClassName('Pokemon').withProperties({
                image: b64,
                text: name
            }).do();
        });

        await Promise.all(promises);
        await processNextBatch();
    }

    await processNextBatch();
}

/*
After storing a few images, we can provide an image
as a query input. The database will use HNSW to quickly
find similar looking images.
*/
async function test () {
    console.log('Testing image similarity...')
    const test = await removeImageBackground('./tests/charmander.png');
    const resImage = await client.graphql.get()
        .withClassName('Pokemon')
        .withFields('image')
        .withNearImage({ image: test })
        .withLimit(1)
        .do();

    // Write result to filesystem
    console.log(Object.keys(resImage.data.Get.Pokemon[0]));
    const result = resImage.data.Get.Pokemon[0].image;
    writeFileSync('./result.jpg', result, 'base64');
}

async function initSchema() {
    console.log('Initializing schema');
    try {
        await createSchema();
        console.log('Schema created');
    } catch (error) {
        try {
            await deleteSchema();
            await createSchema();
        } catch (deleteError) {
            console.error(deleteError);
            process.exit(1);
        }
    }
}

await initSchema();
await trainAllPokedex();
await test();
