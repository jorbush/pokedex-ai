import weaviate from 'weaviate-ts-client'
import { readFileSync, readdirSync, writeFileSync} from "fs"

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

/*
Images must first be converted to base64. Once converted,
store it to the cooresponding class in the schema. Weaviate
will automatically use the neural network in the background
to vectorize it and update the embedding.
*/
async function trainAllPokedex () {
    const imgs = readdirSync('./img')

    const promises = imgs.map((async (img) => {
        const b64 = Buffer.from(readFileSync(`./img/${img}`)).toString('base64')
        await client.data
        .creator()
        .withClassName('Pokemon')
        .withProperties({
            image: b64,
            text: img.split('.')[0].split('_').join(' ')
        })
        .do();
    }))

    await Promise.all(promises)
}

/*
After storing a few images, we can provide an image
as a query input. The database will use HNSW to quickly
find similar looking images.
*/

async function test () {
    const test = Buffer.from( readFileSync('./test.png') ).toString('base64');

    const resImage = await client.graphql.get()
        .withClassName('Pokemon')
        .withFields('image')
        .withNearImage({ image: test })
        .withLimit(1)
        .do();

    // Write result to filesystem
    const result = resImage.data.Get.Pokemon[0].image;
    writeFileSync('./result.jpg', result, 'base64');
}

async function initSchema() {
    try {
        await createSchema();
    } catch (error) {
        try {
            await deleteSchema();
            await createSchema();
        } catch (deleteError) {
            process.exit(1);
        }
    }
}

await initSchema();
await trainAllPokedex();
await test();
