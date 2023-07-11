window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const articlePreviewsContainer = document.getElementById('articlePreviews');
  
    // Fetch the JSON files
    const articleFiles = ['article.json', 'article (1).json', 'article (2).json']; // Replace with your file names
    const articlePromises = articleFiles.map(file => fetch(file).then(response => response.json()));
  
    Promise.all(articlePromises)
      .then(articles => {
        articles.forEach(article => {
          // Extract article details
          const title = article.title;
          const author = article.author;
          const snippet = article.snippet;
          const thumbnailUrl = article.thumbnailUrl;
  
          // Create an article preview element
          const articlePreview = document.createElement('div');
          articlePreview.classList.add('article-preview');
          articlePreview.innerHTML = `
            <h2>${title}</h2>
            <p>Author: ${author}</p>
            <p>${snippet}</p>
            <img src="${thumbnailUrl}" alt="Article Thumbnail">
          `;
  
          articlePreviewsContainer.appendChild(articlePreview);
        });
      })
      .catch(error => {
        console.error('An error occurred while fetching the articles:', error);
      });
  });
  
  
