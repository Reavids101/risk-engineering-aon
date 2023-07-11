window.onload = function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js';
    script.onload = initializePDF;
    document.head.appendChild(script);
  }
  
  let pdfjsLib;
  
  async function initializePDF() {
    if (typeof pdfjsLib !== 'undefined') {
      return;
    }
  
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js';
  
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  
    pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
  
    console.log('PDF.js initialized.');
  }
  
  async function convertPDFToText(file) {
    await initializePDF();
  
    const loadingTask = pdfjsLib.getDocument(file);
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let text = '';
  
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + ' ';
    }
  
    return text;
  }
  
  async function convertMultiplePDFsToText(files) {
    await initializePDF();
  
    const texts = [];
  
    for (const file of files) {
      const fileData = new Uint8Array(await file.arrayBuffer());
      const text = await convertPDFToText(fileData);
      texts.push(text);
    }
  
    return texts;
  }
  
  function extractSnippet(content) {
    const MAX_LENGTH = 100; // Maximum snippet length
    let snippet = content.substr(0, MAX_LENGTH);
    if (content.length > MAX_LENGTH) {
      snippet += '...';
    }
    return snippet;
  }

  async function handleConversion() {
  const fileInput = document.getElementById('pdfFileInput');
  const files = fileInput.files;

  try {
    const jsonData = await convertMultiplePDFsToText(files);
    const articles = [];

    await Promise.all(jsonData.map(async (content, index) => {
      const title = extractTitle(content);
      const author = extractAuthor(content);
      const snippet = extractSnippet(content);
      const pdfUrl = await getPdfUrl(files[index]);

      // Create an article preview element
      const articlePreview = document.createElement('div');
      articlePreview.classList.add('article-preview');
      articlePreview.innerHTML = `
        <h2>${title}</h2>
        <p>Author: ${author}</p>
        <p>${snippet}</p>
        <a href="#" data-pdf-url="${pdfUrl}" class="view-pdf">View PDF</a>
      `;

      const articlePreviewsContainer = document.getElementById('articlePreviews');
      articlePreviewsContainer.appendChild(articlePreview);

      const articleData = {
        title: title,
        author: author,
        snippet: snippet,
        pdfUrl: pdfUrl
        // Add more fields as needed
      };

      articles.push(articleData);

      const jsonContent = convertToJSON(articleData);
      const filename = `article${index + 1}.json`;

      try {
        downloadJSON(jsonContent, filename);
      } catch (error) {
        console.error(`Error downloading JSON for article ${index + 1}:`, error);
        // Continue execution or handle the error as needed
      }
    }));

    showMessage('Conversion and download complete!');
  } catch (error) {
    console.error('Error during conversion and download:', error);
    showMessage('An error occurred during conversion and download.');
  }
}

document.getElementById('convertButton').addEventListener('click', handleConversion);

  
async function handleConversion() {
  const fileInput = document.getElementById('pdfFileInput');
  const files = fileInput.files;

  try {
    const jsonData = await convertMultiplePDFsToText(files);
    const articles = [];

    await Promise.all(jsonData.map(async (content, index) => {
      const title = extractTitle(content);
      const author = extractAuthor(content);
      const snippet = extractSnippet(content);
      let pdfUrl;

      try {
        pdfUrl = await generatePdfUrl(files[index]);
      } catch (error) {
        console.error('Error generating PDF URL for article ${index + 1};', error);
        return;
      }

      // Create an article preview element
      const articlePreview = document.createElement('div');
      articlePreview.classList.add('article-preview');
      articlePreview.innerHTML = `
        <h2>${title}</h2>
        <p>Author: ${author}</p>
        <p>${snippet}</p>
        <a href="#" data-pdf-url="${pdfUrl}" class="view-pdf">View PDF</a>
      `;

      const articlePreviewsContainer = document.getElementById('articlePreviews');
      articlePreviewsContainer.appendChild(articlePreview);

      const articleData = {
        title: title,
        author: author,
        snippet: snippet,
        pdfUrl: pdfUrl
        // Add more fields as needed
      };
      articlePreview.querySelector('.view-pdf').addEventListener('click', handleJsonDownload);

      articles.push(articleData);

      const jsonContent = convertToJSON(articleData);
      const filename = `article${index + 1}.json`;

      try {
        downloadJSON(jsonContent, filename);
      } catch (error) {
        console.error(`Error downloading JSON for article ${index + 1}:`, error);
        // Continue execution or handle the error as needed
      }
    }));

    // Attach event listeners to the "View PDF" links
    const viewPDFLinks = document.getElementsByClassName('view-pdf');
    Array.from(viewPDFLinks).forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const pdfUrl = link.getAttribute('data-pdf-url');
      });
    });

    showMessage('Conversion and download complete!');
  } catch (error) {
    console.error('Error during conversion and download:', error);
    showMessage('An error occurred during conversion and download.');
  }
}


  
  function extractTitle(content) {
    const titleRegex = /Title: (.+)/;
    const match = titleRegex.exec(content);
    return match ? match[1] : '';
  }
  
  function extractAuthor(content) {
    const authorRegex = /Author: (.+)/;
    const match = authorRegex.exec(content);
    return match ? match[1] : '';
  }
  
  function convertToJSON(articleData) {
    return JSON.stringify(articleData);
  }
  
  
  
  function downloadJSON(content, filename) {
    const element = document.createElement('a');
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = filename;
    element.click();
    URL.revokeObjectURL(url);
  }
  
  function showMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
  }
  
  document.getElementById('convertButton').addEventListener('click', handleConversion);

  async function generateThumbnailUrl(title, pdfUrl) {
    const unsplashAccessKey = 'WESHPPb5k-8k9b8flIl-Nt505I309BlJ2E8VTFyI03w';
    const unsplashBaseUrl = 'https://source.unsplash.com';


    
    const encodedTitle = encodeURIComponent(title);
    const thumbnailUrl = '{$unsplashBaseUrl}/featured/?${encodedTitle}&sig=1&client_id=${unsplashAccessKey}&pdf_url=${encodeURIComponent(pdfUrl)}';

    return thumbnailUrl


  }

  function handleJsonDownload(event) {
    event.preventDefault();
  
    const target = event.target;
    const articleIndex = target.getAttribute('data-article-index');
    const articleData = articles[articleIndex];
  
    const jsonContent = JSON.stringify(articleData);
    const filename = `article${parseInt(articleIndex) + 1}.json`;
  
    const element = document.createElement('a');
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = filename;
    element.click();
    URL.revokeObjectURL(url);
  }
  
  
  
  
  
  

