const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

    // Aquí conectaremos el cerebro de Axtrix-cdx
    // con la IA en el siguiente paso.

    res.json({
      reply: "Axtrix recibió tu mensaje: " + message
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error interno de Axtrix-cdx."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Axtrix-cdx funcionando en el puerto ${PORT}`);
});
