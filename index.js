const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://achados-perdidos.vercel.app"],
  })
);
app.use(fileUpload());

app.post("/", async (req, res) => {
  if (!req.files || !req.files.rdmfile) {
    res.status(400);

    return res.json({ error: true, errorMsg: "No rdmfile provided" });
  }

  try {
    const parsedRdm = await pdfParse(req.files.rdmfile);

    const isAuth = parsedRdm.text.includes(req.body.registrationCode);

    return res.json({
      isAuth,
    });
  } catch (error) {
    res.status(400);
    return res.json({ error: true, errorMsg: "Can't parse rdmfile" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
