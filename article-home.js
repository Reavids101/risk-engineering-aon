document.addEventListener("DOMContentLoaded", () => {
  
// Define a variable that holds the base URL
const baseURL = "https://raw.githubusercontent.com/reavids101/risk-engineering-aon/main/";

// Define an array of file names
const fileNames = [
  "Wellington Letter September 7, 2020.json",
  "Steam Explosions.json",
  "US CSB 2020 Hurricane Season_Guidance for Chemical Plants During Extreme Weather Events.json",
  "AIM Learning Series 2.0.json",
  "alternative-heating.json",
  "Aon Hurricane Season Preparation and Response 2020.json",
  "NFPA 70B Checklist NATURAL DISASTER ELECTRICAL EQUIPMENT.json",
  "Management Of Change MOC.json",
  "icheme-lessons-learned-database.json",
  "IBHS-Small Hail-Big Problems-New Approach 20230419.json",
  "Hazards of High Oxygen Concentration_English.json",
  "Get Help.lnk.json",
  "Freezing-Weather-Last-Minute-Checklist_IBHS.json",
  "Freezing-Bursting-Pipes_IBHS.json",
  "FreezeTips.json",
  "Combustible Mists_English.json",
  "Automatic vs Manual control.json",
  "202201beaconenglish-PID.json"
  // add more file names as needed
];

// Loop through each file name and fetch the corresponding JSON data
Promise.all(fileNames.map((fileName) => fetch(`${baseURL}${fileName}`).then((response) => response.json())))
  .then((data) => {
    renderArticles(data);
  })
  .catch((error) => {
    console.error("Error loading articles:", error);
  });

function renderArticles(articles) {
  const container = document.getElementsByClassName("article-preview");
  if (!container) {
    console.error("Error: Cannot find container element with ID 'articles'");
    return;
  }
  container[0].innerHTML = "";

  articles.forEach((article) => {
    const articleElement = createArticleElement(article);
    container[0].appendChild(articleElement);
  });
}

function createArticleElement(article) {
  const element = document.createElement("div");
  element.classList.add("article");
  element.innerHTML = `
    <h2 class="article-title">${article.title}</h2>
    <p class="article-snippet">${article.snippet}</p>
    <button class="view-btn">Read more</button>
  `;

  // Add a click event listener to the "Read more" button
  const viewBtn = element.querySelector(".view-btn");
  viewBtn.addEventListener("click", () => {
    // Load the PDF file using PDF.js
    const pdfUrl = article.pdfUrl;
    const pdfjsLib = window["pdfjs-dist/build/pdf"];
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    // Render the PDF file in a new tab
    loadingTask.promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const canvas = document.createElement("canvas");
        const viewport = page.getViewport({ scale: 1.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const canvasContext = canvas.getContext("2d");
        const renderTask = page.render({ canvasContext, viewport });
        renderTask.promise.then(() => {
          const pdfWindow = window.open("");
          pdfWindow.document.write("<html><head><title>PDF Viewer</title></head><body>");
          pdfWindow.document.write(`<embed width="100%" height="100%" name="plugin" src="${pdfUrl}" type="application/pdf">`);
          pdfWindow.document.write("</body></html>");
        });
      });
    });
  });

  return element;
}
});