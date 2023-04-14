import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
  organization: "org-xFGfYJeXqqkWoksUQJhJWnhb",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt, size } = req.body;

    const imageSize =
      size === "small"
        ? "256x256"
        : size === "medium"
        ? "512x512"
        : "1024x1024";

    const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });

    console.log(response);

    const image = response.data.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    } else {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
});

export default router;
