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
  const container = document.getElementById("articles");
  if (!container) {
    console.error("Error: Cannot find container element with ID 'articles'");
    return;
  }
  container.innerHTML = "";

  articles.forEach((article) => {
    const articleElement = createArticleElement(article);
    container.appendChild(articleElement);
  });
}

function createArticleElement(article) {
  const element = document.createElement("div");
  element.classList.add("article");
  element.innerHTML = `
    <h2 class="article-title">${article.title}</h2>
    <p class="article-snippet">${article.snippet}</p>
    <a class="article-read-more" href="${article.pdfUrl}">Read more</a>
  `;
  return element;
}
});