import fs from "fs";

export function readCSV(path: string) {
  const strData = fs.readFileSync(path, "utf8");

  const arrData = strData.split("\n").map((line) => line.split(","));

  const headers = arrData[0];
  const records = arrData
    .slice(1)
    .map((row) => {
      const record: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    })
    .filter((record) => !!record.id);

  return records;
}

export async function writeCSV(path: string, data: { [key: string]: any }[]) {
  const headers = Object.keys(data[0]);
  let strData =
    headers.join(",") +
    "\n" +
    data
      .map((row) => headers.map((header) => row[header]).join(","))
      .join("\n");

  //   for (let i = 0; i < data.length; i++) {
  //     strData += "\n";
  //     strData += headers.map((header) => data[i][header]).join(",");
  //   }

  const file = fs.openSync(path, "w");
  fs.writeFileSync(file, strData);
  fs.closeSync(file);
}
