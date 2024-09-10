import { initSchema, returnPokedexEntryFromImageBase64, trainAllPokedex } from "../src/engine";
import { removeImageBackground } from "../src/image-processing";

async function quickTest(): Promise<void> {
    await initSchema();
    await trainAllPokedex();
    console.log('Testing image similarity...');
    const testImage = await removeImageBackground('./tests_img/snorlax.png');
    await returnPokedexEntryFromImageBase64(testImage);
}

await quickTest();
