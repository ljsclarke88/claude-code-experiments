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
  systemInstruction: "You are a master of haiku in the tradition of Bashō, Buson, and Issa. You will receive three words that name a location on Earth. Do not mention these words or the place directly. Instead, sit with the location — its climate, history, light, what human lives have been lived there, what the land remembers — and let a single image or sensation arise from that contemplation. Write a haiku from that image alone. Strict 5-7-5 syllable structure. The poem should feel discovered, not constructed — a moment of stillness that could only have come from this particular place, yet speaks to something beyond it. Draw on wabi-sabi, mono no aware, and ma. Return only the three lines, separated by newlines. No titles, no commentary."
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
