import puppeteer from "puppeteer";
import { readCSV, writeCSV } from "./readCSV.js";

let data: any = {};
let csvdata: any = null;

csvdata = await readCSV("./pk.csv");
console.log("CSV Data:", csvdata);

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1080, height: 1024 });
await page.setUserAgent(
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
);

// Navigate the main page
await page.goto("https://www.cardmarket.com/", {
  waitUntil: "domcontentloaded",
});

await page.setUserAgent(
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
);

await page.goto("https://www.cardmarket.com/", {
  waitUntil: "domcontentloaded",
});

data = await page.evaluate(() => {
  const el = document.querySelector("body");

  if (!el) return null;

  return {
    text: el.textContent?.trim(),
  };
});

console.log("---->", data);
console.log("---------------------------------------------------------------");

///////////////////////////

let freshData = [];
for (let i = 0; i < csvdata.length; i++) {
  const id = csvdata[i].id;
  console.log(`Processing ID: ${id} (${i + 1} of ${csvdata.length})`);
  const price = await readCardMarket(id);

  freshData[i] = {};
  freshData[i].name = csvdata[i].name;
  freshData[i].id = csvdata[i].id;
  freshData[i].price = Number(
    (price || "").replace("€", "").trim().replace(",", ".")
  );
  freshData[i].lastupdate = new Date().toISOString();

  // Print the full title.
  console.log("---->", freshData[i]);

  Bun.sleep(2000);
}

await writeCSV("./pk.csv", freshData);

async function readCardMarket(id: string) {
  await page.goto(
    `https://www.cardmarket.com/es/Pokemon/Products/Singles/${id}?sellerCountry=12,17,26,10&language=1,4`,
    {
      waitUntil: "domcontentloaded",
    }
  );

  let data = await page.evaluate(() => {
    const el = document.querySelector("#table .table-body .article-row");
    //   const el = document.querySelector("body");

    if (!el) return null;

    const text = el.querySelector(".price-container").textContent?.trim();

    return text;
  });

  return data;
}

await browser.close();
