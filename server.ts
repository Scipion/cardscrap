import express from "express";
import { readCSV } from "./readCSV";
import { renderHtmlTable } from "./renderHtmlTable";
// import { renderTemplate } from './template-engine/render';

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const data = readCSV("./pk.csv");
    // const html = renderTemplate('page.html', req.body);
    const html = renderHtmlTable(data);

    res.status(200).contentType("text/html").send(html);
  } catch (err) {
    res.status(500).json({ error: "Template render error" });
  }
});

app.listen(4004, () => {
  console.log("Server running on http://localhost:4004");
});
