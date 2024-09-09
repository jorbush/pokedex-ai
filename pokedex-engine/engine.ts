import weaviate from 'weaviate-ts-client';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { removeBackground } from '@imgly/background-removal-node';

interface PokemonData {
    Ab: Array<{ n: string; id: number; isH: boolean }>;
    BE: number;
    H: number;
    HI: string[];
    id: number;
    isD: boolean;
    N: string;
    Sp: { n: string; id: number };
    St: Array<{ n: string; EV: number; bs: number }>;
    T: Array<{ n: string; id: number }>;
    W: number;
}

export const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

async function createSchema(): Promise<void> {
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

async function deleteSchema(): Promise<void> {
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
async function trainAllPokedex(): Promise<void> {
    try {
        const imgs = readdirSync('./img');
        console.log('Training Pokedex engine with images...');
        const maxConcurrent = 15;
        let index = 0;
        async function processNextBatch() {
            if (index >= imgs.length) return;
            const batch = imgs.slice(index, index + maxConcurrent);
            index += maxConcurrent;
            const promises = batch.map(async (img) => {
                const b64 = Buffer.from(readFileSync(`./img/${img}`)).toString('base64')
                const name = img.split('.')[0].split('_').join(' ');
                await client.data.creator().withClassName('Pokemon').withProperties({
                    image: b64,
                    text: name
                }).do();
            });
            await Promise.all(promises);
            await processNextBatch();
        }
        await processNextBatch();
    } catch (error) {
        console.error('Error training Pokedex:', error);
    }
}

function returnPokedexData(number: number): PokemonData {
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
async function test(): Promise<void> {
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

async function initSchema(): Promise<void> {
    console.log('Initializing schema...');
    try {
        await createSchema();
    } catch (error) {
        try {
            await deleteSchema();
            await createSchema();
        } catch (deleteError) {
            console.error('Failed to create schema:', error);
            console.error('Failed to delete and recreate schema:', deleteError);
            process.exit(1);
        }
    }
    console.log('Schema created');
}

await initSchema();
await trainAllPokedex();
await test();
