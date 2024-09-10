import { Hono } from 'hono';
import {
    initSchema,
    returnPokedexEntryFromImageBase64,
    trainAllPokedex,
} from './src/engine';

const app = new Hono();

app.get('/', (c) => {
    return c.json({ message: 'Hello Bun!' });
});

app.post('/pokedex', async (c) => {
    try {
        const { image } = await c.req.json();
        if (!image) {
            return c.json({ error: 'No image provided' }, 400);
        }
        const data = await returnPokedexEntryFromImageBase64(image);
        return c.json({ data });
    } catch (error) {
        console.error('Error processing the request:', error);
        return c.json({ error: 'Failed to process request' }, 500);
    }
});

console.log('Initializing Pokedex Engine...');
await initSchema();
await trainAllPokedex();
console.log('Pokedex Engine initialized!');

const port = parseInt(process.env.PORT!) || 3000;
console.log(`Running at http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
