const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conexión segura: la API key vendrá de una variable de entorno
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Axtrix-cdx está funcionando.");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "No se recibió un mensaje válido."
      });
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: message
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("Error de Axtrix:", error);

    res.status(500).json({
      error: "Axtrix no pudo responder en este momento."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Axtrix-cdx funcionando en el puerto ${PORT}`);
});
