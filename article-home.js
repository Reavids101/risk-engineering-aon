document.addEventListener('DOMContentLoaded', () => {
    const articlePreviewsContainer = document.getElementById('articlePreviews');
    articlePreviewsContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;
        if (target.classList.contains('view-pdf')) {
            const pdfUrl = target.getAttribute('data-pdf-url');
            displayPDF(pdfUrl);
            handleJsonDownload(event);
        }
    });
  
    // Fetch the JSON files
    const articleFiles = ['article1.json', 'article2.json', 'article3.json']; // Replace with your file names
    const articlePromises = articleFiles.map((file) => fetch(file).then((response) => response.json()));
  
    Promise.all(articlePromises)
      .then((articles) => {
        articles.forEach((article) => {
          // Extract article details
          const title = article.title;
          const author = article.author;
          const snippet = article.snippet;
          const thumbnailUrl = article.thumbnailUrl;
          const pdfUrl = article.pdfUrl;
  
          // Create an article preview element
          const articlePreview = document.createElement('div');
          articlePreview.classList.add('article-preview');
          articlePreview.innerHTML = `
            <h2>${title}</h2>
            <p>Author: ${author}</p>
            <p>${snippet}</p>
            <img src="${thumbnailUrl}" alt="Article Thumbnail">
            <a href="#" data-pdf-url="${pdfUrl}" class="view-pdf">View PDF</a>
          `;
  
          // Attach a click event listener to load and display the PDF
          articlePreview.addEventListener('click', () => {
            displayPDF(pdfUrl);
          });
  
          articlePreviewsContainer.appendChild(articlePreview);
        });
      })
      .catch((error) => {
        console.error('An error occurred while fetching the articles:', error);
      });

  
    function displayPDF(pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  });
  
  
  
  


  
  
