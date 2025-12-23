import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function renderHtmlTable(data: { [key: string]: any }[]): string {
  if (data.length === 0) {
    return "<p>No data available</p>";
  }

  const headers = Object.keys(data[0]);
  let html = "<table border='1'><thead><tr>";

  // Table headers
  for (const header of headers) {
    html += `<th>${header}</th>`;
  }
  html += "</tr></thead><tbody>";

  // Table rows
  //(row[header] || "").toFixed(2) + "€"
  for (const row of data) {
    html += "<tr>";
    for (const header of headers) {
      if (header === "price") {
        html += `<td>${
          row[header] ? Number(row[header]).toFixed(2) + "€" : ""
        }</td>`;
        continue;
      }
      if (header === "image") {
        html += `<td><img src="${row[header]}" alt="Image" width="50"/></td>`;
        continue;
      }
      if (header === "lastupdate") {
        const date = new Date(row[header]);
        const d = dayjs(date);
        html += `<td>${
          isNaN(date.getTime()) ? "" : dayjs(date).format("YYYY-MM-DD HH:mm:ss")
        } (${dayjs(date).fromNow(true)})</td>`;
        continue;
      }
      html += `<td>${row[header]}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  return html;
}
