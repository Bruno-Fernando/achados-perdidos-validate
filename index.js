const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const PORT = process.env.PORT || 8000;
const URL = "https://pre.ufcg.edu.br:8443/ControleAcademicoOnline/";

app.use(express.json());

app.get("/", async (req, res) => {
  const { registrationCode, password } = req.body;

  // Inicia uma nova instancia do navegador
  const browser = await puppeteer.launch({ headless: "new" });

  // Abre uma aba
  const page = await browser.newPage();

  // Vai para o controle academico
  await page.goto(URL);

  // Digita a matricula e a senha nos campos adequados
  await page.type("#login", registrationCode);
  await page.type("#senha", password);

  // Submete o form contendo matricula e senha e espera o retorno da api
  await Promise.all([
    page.click("button[type=submit]"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // Caso o login tenha acontecido com sucesso, procura na home do
  // controle academico o número de matricula, caso esteja igual
  // significa que o login aconteceu com sucesso
  // caso contrario o login não foi efetuado
  const isAuth = await page.evaluate((reqRegistrationCode) => {
    const scrapedRegistrationCode = document
      .querySelector(".col-sm-9 , .col-xs-7")
      ?.innerHTML.split(" ")[0];

    if (scrapedRegistrationCode === reqRegistrationCode) {
      return true;
    } else {
      return false;
    }
  }, registrationCode);

  // Fecha a instancia do navegador
  await browser.close();

  res.json({
    isAuth,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});