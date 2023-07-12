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

        // Create a card element for the article preview
        var card = document.createElement("div");
        card.classList.add("card", "mb-3");

        // Create an image element for the thumbnail
        var img = document.createElement("img");
        img.classList.add("card-img-top");
        img.src = article.thumbnailURL;
        card.appendChild(img);

        // Create the card body element
        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.appendChild(cardBody);

        // Create the card title element
        var title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = article.title;
        cardBody.appendChild(title);

        // Create the card author element
        var author = document.createElement("p");
        author.classList.add("card-text");
        author.textContent = "By " + article.author;
        cardBody.appendChild(author);

        // Create the card snippet element
        var snippet = document.createElement("p");
        snippet.classList.add("card-text");
        snippet.textContent = article.snippet;
        cardBody.appendChild(snippet);

        // Create the view button element
        var viewBtn = document.createElement("button");
        viewBtn.classList.add("btn", "btn-primary");
        viewBtn.textContent = "View PDF";
        viewBtn.addEventListener("click", function() {
          // Load the PDF file using PDF.js
          var viewerContainer = document.getElementById("viewer");
          pdfjsLib.getDocument(article.pdfURL).promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
              var scale = 1.5;
              var viewport = page.getViewport({ scale: scale });
              var canvas = document.createElement("canvas");
              var context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              viewerContainer.appendChild(canvas);
              page.render({
                canvasContext: context,
                viewport: viewport
              });
            });
          });
        });
        cardBody.appendChild(viewBtn);

        // Add the card to the articles container
        articlesContainer.appendChild(card);
      }
    })
    .catch(error => console.error("Error loading articles:", error));
}
  
  
  
  


  
  
