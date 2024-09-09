import weaviate from 'weaviate-ts-client';
import { readFileSync, readdirSync, writeFileSync } from 'fs';

const { removeBackground } = require('@imgly/background-removal-node');

export const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

async function createSchema() {
    const schemaConfig = {
        class: 'Pokemon',
        vectorizer: 'img2vec-neural',
        vectorIndexType: 'hnsw',
        moduleConfig: {
            'img2vec-neural': {
                imageFields: ['image'],
            },
        },
        properties: [
            {
                name: 'image',
                dataType: ['blob'],
            },
            {
                name: 'text',
                dataType: ['string'],
            },
        ],
    };

    await client.schema.classCreator().withClass(schemaConfig).do();
}

async function deleteSchema() {
    await client.schema.classDeleter().withClassName('Pokemon').do();
}

async function removeImageBackground(imgSource: string): Promise<string> {
    const blob = await removeBackground(imgSource);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return buffer.toString('base64');
}

/*
Images must first be converted to base64. Once converted,
store it to the cooresponding class in the schema. Weaviate
will automatically use the neural network in the background
to vectorize it and update the embedding.
*/
async function trainAllPokedex() {
    console.log('Training pokedex with images...');
    const promises = readdirSync('./img').map(async (img) => {
        const b64 = Buffer.from(readFileSync(`./img/${img}`)).toString(
            'base64'
        );
        const name = img.split('.')[0].split('_').join(' ');
        await client.data
            .creator()
            .withClassName('Pokemon')
            .withProperties({
                image: b64,
                text: name,
            })
            .do();
    });
    await Promise.all(promises);
}

function returnPokedexData(number: number) {
    const pokedexData = JSON.parse(
        readFileSync('./pokemon.json').toString()
    ).pokemon;
    return pokedexData[number];
}

/*
After storing a few images, we can provide an image
as a query input. The database will use HNSW to quickly
find similar looking images.
*/
async function test() {
    console.log('Testing image similarity...');
    const test = await removeImageBackground('./img/004.png');
    const resImage = await client.graphql
        .get()
        .withClassName('Pokemon')
        .withFields('image text')
        .withNearImage({ image: test })
        .withLimit(1)
        .do();
    let originalName: string = resImage.data.Get.Pokemon[0].text;
    if (originalName.includes(' ')) {
        originalName = originalName.split(' ')[0];
    }
    console.log(`Pokedex Number: ${originalName}`);
    const data = returnPokedexData(parseInt(originalName));
    console.log(`Pokedex Entry: ${JSON.stringify(data)}`);
    writeFileSync(
        `./result.jpg`,
        Buffer.from(readFileSync(`./img/${originalName}.png`)).toString(
            'base64'
        ),
        'base64'
    );
}

async function initSchema() {
    console.log('Initializing schema...');
    try {
        await createSchema();
    } catch (error) {
        console.error(error);
        try {
            await deleteSchema();
            await createSchema();
        } catch (deleteError) {
            console.error(deleteError);
            process.exit(1);
        }
    }
    console.log('Schema created');
}

await initSchema();
await trainAllPokedex();
await test();
