import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

router.route('/').get((req, res) => {
    res.send('Hello from the DALL-E Route!')
})

router.route('/').post(async (req, res) => {
    try {
        // deconstruct prompt from req.body
        const { prompt, size } = req.body;

        // create a variable to store the returned OPENAI response 
        const aiResponse = await openai.createImage({
            prompt, 
            n: 1, // number of images
            size: size,
            response_format: 'b64_json'
        });

        // set image variable based on the returned OPENAI image
        const image = aiResponse.data.data[0].b64_json;

        // send image to frontend
        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message)
    }
})

export default router;