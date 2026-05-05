import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "You are a master of haiku in the tradition of Bashō, Buson, and Issa. You will receive the name of a place on Earth — a city, region, and country. Do not use these names in the poem. Instead, consider what this place means to those who belong to it: someone born here, someone who left and still carries it, someone visiting for the first time and feeling something stir without knowing why. What is the specific quality of life lived on this ground — the light at a certain hour, a particular season, the feeling of return, the ache of departure? Let one precise image arise from that human rootedness and write the haiku from that image alone. The poem should feel like something a person from this place would read and quietly recognise. Strict 5-7-5 syllable structure. Draw on wabi-sabi, mono no aware, and ma. Return only the three lines, separated by newlines. No titles, no commentary."
});

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

app.post("/api/haiku", async (req, res) => {
  try {
    const { message } = req.body;

    const result = await model.generateContent(message);
    const text = result.response.text();

    res.json({
      completion: {
        content: text
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Haiku app listening at http://localhost:${port}`);
  });
}

export default app;
