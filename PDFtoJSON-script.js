document.addEventListener('DOMContentLoaded', function() {

  var pdfUrls = [];

  document.getElementById('convertBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    var files = document.getElementById('fileInput').files;
    convertToJSON(files);
  });

  function convertToJSON() {
    // Get the PDF file input element
    var inputElement = document.getElementById('fileInput');

    console.log('Input element:', inputElement);

    // Check that the input element exists
    if (!inputElement) {
      console.log('Input element not found');
      return;
    }

    // Get the selected files
    var files = inputElement.files;

    console.log('Files:', files);

    // Check that at least one file was selected
    if (files.length === 0) {
      console.log('No files selected');
      return;
    }

    var fileNames = [];

    // Loop through each file and generate a URL for the corresponding PDF
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // Add the file name to the array of file names
      fileNames.push(file.name);
    }

    // Check that the fileNames array is not empty
    if (fileNames.length === 0) {
      console.log('No file names found');
      return;
    }

    // Check that the FileReader API is available
    if (!window.FileReader) {
      console.log('The FileReader API is not available');
      return;
    }

    // Create an array to hold the PDF URLs
    var pdfUrls = [];

    // Loop through each file and generate a URL for the corresponding PDF
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // Generate a URL for the PDF file
      var pdfUrl = URL.createObjectURL(file);

      // Add the URL to the array of PDF URLs
      pdfUrls.push(pdfUrl);
    }

    // Check that the pdfUrls array is not empty
    if (pdfUrls.length === 0) {
      console.log('No PDF URLs found');
      return;
    }

    // Extract information from each PDF file
    extractPDFInfo(files, pdfUrls, fileNames);
  }

  var outputElem = document.getElementById('output');
  if (!outputElem) {
    console.log('Error: output element not found');
    return;
  }

  function extractPDFInfo(files) {
    // Loop through each file and prompt the user for the PDF URL
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileName = file.name;
  
      console.log('Processing file:', fileName);
  
      // Prompt the user for the PDF URL
      var pdfUrl = prompt('Enter the PDF URL for "' + fileName + '":');
      if (!pdfUrl) {
        console.log('No PDF URL entered for:', fileName);
        continue;
      }
  
      console.log('PDF URL:', pdfUrl);
  
      // Read the PDF file using the FileReader API
      var fileReader = new FileReader();
  
      fileReader.onload = function(event) {
        console.log('File loaded:', fileName);
  
        // Parse the PDF file using PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
        pdfjsLib.verbosity = pdfjsLib.VerbosityLevel.ERRORS;
  
        pdfjsLib.getDocument({ data: event.target.result }).promise.then(function(pdf) {
          console.log('PDF loaded:', pdf.numPages, 'pages');
  
          // Get the first page of the PDF document
          return pdf.getPage(1).then(function(page) {
            // Get the text content of the page
            return page.getTextContent().then(function(textContent) {
              // Combine the text items into a single string
              var text = textContent.items.map(function(item) {
                return item.str;
              }).join('');
  
              // Extract a snippet of text from the PDF file
              var snippet = extractSnippet(text);
  
              console.log('Snippet:', snippet);
  
              // Create a JSON object to hold the extracted information
              var json = {
                title: fileName,
                pdfUrl: pdfUrl,
                snippet: snippet
              };
  
              // Add the JSON object to the output
              var jsonText = JSON.stringify(json);
              var outputDiv = document.createElement('div');
              outputDiv.innerHTML = '<pre>' + jsonText + '</pre>';
              outputElem.appendChild(outputDiv);
  
              // Create a download link for the JSON file
              var blob = new Blob([jsonText], {type: 'application/json'});
              var url = URL.createObjectURL(blob);
              var downloadLink = document.createElement('a');
              downloadLink.href = url;
              downloadLink.download = fileName + '.json';
              downloadLink.innerHTML = 'Download JSON';
              outputDiv.appendChild(downloadLink);
            });
          });
        }).catch(function(error) {
          console.log('Error:', error);
        });
      };
  
      fileReader.readAsArrayBuffer(file);
    }
  }
  
  function extractSnippet(text) {
    const MAX_LENGTH = 200; // Maximum snippet length
    let snippet = text.substr(0, MAX_LENGTH);
    if (text.length > MAX_LENGTH) {
      snippet += '...';
    }
    return snippet;
  }
});
  
  function saveAsJSON(article, fileName, callback) {
    // Convert the article to a JSON string
    var jsonString = JSON.stringify(article, null, 2);
  
    // Create a Blob object from the JSON string
    var blob = new Blob([jsonString], { type: "application/json" });
  
    // Trigger the download of the JSON file
    handleDownload(blob, fileName);
  
    // Call the callback function if it is provided
    if (callback) {
      callback();
    }
  }

    
function handleDownload(blob, fileName) {
  // Create a new link element
  var link = document.createElement('a');
  link.download = fileName;

  // Create a URL for the blob
  var url = URL.createObjectURL(blob);

  // Set the href attribute of the link element
  link.href = url;

  // Append the link element to the DOM
  document.body.appendChild(link);

  // Click the link element to trigger the download
  link.click();

  // Remove the link element from the DOM
  document.body.removeChild(link);

  // Revoke the URL to free up memory
URL.revokeObjectURL(url);

};