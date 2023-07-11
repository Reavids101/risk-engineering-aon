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
  });
  
  function displayPDF(pdfUrl) {
    // Embed the PDF using Adobe PDF Embed API
    const adobeDCView = new AdobeDC.View({ clientId: '9114ab4228ab4d7aa486687f57a135da', divId: 'pdf-viewer' });
    adobeDCView.previewFile({
      content: { location: { url: pdfUrl } },
      metaData: { fileName: 'Document' }
    }, {});
  }
  


  
  
