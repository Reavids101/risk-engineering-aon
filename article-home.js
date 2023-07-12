// Define an array to store the articles
var articles = [];

// Fetch the JSON files and add the articles to the array
for (var i = 0; i < 3; i++) {
  var url = "https://raw.githubusercontent.com/reavids101/risk-engineering-aon/main/article (" + i + ").json";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      articles = articles.concat(data);
      
      // Get the articles container element
      var articlesContainer = document.getElementById("articles");

      // Loop through each article and create an article preview
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];

        // Create a div element for the article preview
        var articlePreview = document.createElement("div");
        articlePreview.classList.add("article-preview");

        // Create the article preview title element
        var title = document.createElement("h2");
        title.textContent = article.title;
        articlePreview.appendChild(title);

        // Create the article preview author element
        var author = document.createElement("div");
        author.classList.add("author");
        author.textContent = "By " + article.author;
        articlePreview.appendChild(author);

        // Create the article preview snippet element
        var snippet = document.createElement("div");
        snippet.classList.add("snippet");
        snippet.textContent = article.snippet;
        articlePreview.appendChild(snippet);

        // Create the view button element
        var viewBtn = document.createElement("button");
        viewBtn.classList.add("view-btn");
        viewBtn.textContent = "View PDF";
        viewBtn.addEventListener("click", function() {
          // Remove any existing PDF viewer element
          var pdfViewerContainer = document.getElementById("pdf-viewer");
          while (pdfViewerContainer.firstChild) {
            pdfViewerContainer.removeChild(pdfViewerContainer.firstChild);
          }

          // Create a new PDF viewer element
          var pdfViewer = document.createElement("iframe");
          pdfViewer.src = article.pdfURL;
          pdfViewer.classList.add("pdf-viewer");
          pdfViewerContainer.appendChild(pdfViewer);
        });
        articlePreview.appendChild(viewBtn);

        // Add the article preview to the articles container
        articlesContainer.appendChild(articlePreview);
      }
    })
    .catch(error => console.error("Error loading articles:", error));
}