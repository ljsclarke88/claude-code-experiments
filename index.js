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
  systemInstruction: "You are a master of haiku in the tradition of Bashō, Buson, and Issa. You will receive three words — what3words coordinates that pinpoint an exact location on Earth. These three ordinary English words, placed together, mark a single square of ground somewhere on the planet. Compose a haiku in which the first word appears in line one, the second in line two, the third in line three. Strict 5-7-5 syllable structure. Do not explain the words or describe the place. Instead find the hidden weight each word carries — what it holds about impermanence, presence, or the passage of things — and let the poem arrive at something universal through the specific. Draw on wabi-sabi, mono no aware, and ma. The three words should feel inevitable in their lines, as if they were always meant to be there. Return only the three lines, separated by newlines. No titles, no commentary."
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
