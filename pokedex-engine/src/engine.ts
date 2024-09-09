import { createSchema, deleteSchema, client } from './schema';
import {
    removeImageBackground,
    convertImageToBase64,
} from './image-processing';
import { getPokedexData } from './pokedex';
import { readdirSync, writeFileSync } from 'fs';

async function initSchema(): Promise<void> {
    console.log('Initializing schema...');
    try {
        await createSchema();
        console.log('Schema created');
    } catch (error) {
        console.log('The schema already exists');
        console.log('Trying to delete and recreate schema...');
        try {
            await deleteSchema();
            await createSchema();
            console.log('Schema recreated');
        } catch (deleteError) {
            console.error('Failed to delete and recreate schema:', deleteError);
            process.exit(1);
        }
    }
}

async function trainAllPokedex(): Promise<void> {
    try {
        const imgs = readdirSync('./img');
        console.log('Training Pokedex with images...');
        const maxConcurrent = 15;
        let index = 0;
        async function processNextBatch() {
            if (index >= imgs.length) return;
            const batch = imgs.slice(index, index + maxConcurrent);
            index += maxConcurrent;
            const promises = batch.map(async (img) => {
                const b64 = convertImageToBase64(`./img/${img}`);
                const name = img.split('.')[0].split('_').join(' ');
                await client.data
                    .creator()
                    .withClassName('Pokemon')
                    .withProperties({ image: b64, text: name })
                    .do();
            });
            await Promise.all(promises);
            await processNextBatch();
        }
        await processNextBatch();
    } catch (error) {
        console.error('Error training Pokedex:', error);
    }
}

async function test(): Promise<void> {
    console.log('Testing image similarity...');
    const testImage = await removeImageBackground('./tests_img/snorlax.png');
    const resImage = await client.graphql
        .get()
        .withClassName('Pokemon')
        .withFields('image text')
        .withNearImage({ image: testImage })
        .withLimit(1)
        .do();
    const originalName: string =
        resImage.data.Get.Pokemon[0].text.split(' ')[0];
    console.log(`Pokedex Number: ${originalName}`);
    const data = getPokedexData(parseInt(originalName));
    console.log(`Pokedex Entry: ${JSON.stringify(data)}`);
    writeFileSync(
        `./result.jpg`,
        convertImageToBase64(`./img/${originalName}.png`),
        'base64'
    );
}

await initSchema();
await trainAllPokedex();
await test();
