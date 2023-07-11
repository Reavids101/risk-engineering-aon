window.addEventListener('DOMContentLoaded', () => {
    const articlePreviewsContainer = document.getElementById('articlePreviews');
  
    // Fetch the JSON files
    const articleFiles = ['article.json', 'article (1).json', 'article (2).json']; // Replace with your file names
    const articlePromises = articleFiles.map((file) => fetch(file).then((response) => response.json()));
  
    Promise.all(articlePromises)
      .then((articles) => {
        articles.forEach((article) => {
          // Extract article details
          const title = article.title;
          const author = article.author;
          const snippet = article.snippet;
          const thumbnailUrl = article.thumbnailUrl;
          const pdfUrl = article.pdfUrl; // Add the PDF URL field to your JSON structure
  
          // Create an article preview element
          const articlePreview = document.createElement('div');
          articlePreview.classList.add('article-preview');
          articlePreview.innerHTML = `
            <h2>${title}</h2>
            <p>Author: ${author}</p>
            <p>${snippet}</p>
            <img src="${thumbnailUrl}" alt="Article Thumbnail">
          `;
  
            const articleWrapper = document.createElement('div');
            articleWrapper.classList.add('article-preview-wrapper');
            articleWrapper.appendChild(articlePreview);

            articleWrapper.addEventListener('click', () => {
                loadPDF(pdfUrl);
            });
            articlePreviewsContainer.appendChild(articleWrapper);
        });
      })
      .catch((error) => {
        console.error('An error occurred while fetching the articles:', error);
      });
  });
  
  function loadPDF(pdfUrl) {
    pdfjsLib.getDocument(pdfUrl).promise
      .then((pdf) => {
        const viewerContainer = document.getElementById('pdfViewer');
        const viewer = new pdfjsViewer.PDFViewer({
          container: viewerContainer,
        });
        viewer.setDocument(pdf);
      })
      .catch((error) => {
        console.error('Error loading PDF:', error);
      });
  }

  
  
