function navigateToUrl(url) {
  window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function() {
  
  const element = document.querySelector('.gallery-item');
  console.log(element);
  if (element) {
    element.classList.add('animate-slide-up');
  }
  
  // Get necessary elements
  const gallery = document.querySelector('.gallery');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const pagination = document.querySelector('.gallery-pagination');
  
  // Set initial page
  let currentPage = 0;
  let initialX = null;
  
  // Add event listeners for touch/swipe gestures
  if (gallery) {
    gallery.addEventListener("touchstart", handleTouchStart);
    gallery.addEventListener('touchmove', handleTouchMove);
  }
  
  // Handle touch start event
  function handleTouchStart(event) {
    initialX = event.touches[0].clientX;
  }
  
  // Handle touch move event
  function handleTouchMove(event) {
    if (!initialX) {
      return;
    }
  
    const currentX = event.touches[0].clientX;
    const diffX = initialX - currentX;
  
    if (diffX > 0 && diffX > 50) {
      // Swiped left
      showNextPage();
    } else if (diffX < 0 && diffX < -50) {
      // Swiped right
      showPreviousPage();
    }
  
    initialX = null;
  }
  
  // Function to show next page
  function showNextPage() {
    if (currentPage < galleryItems.length - 1) {
      currentPage++;
      updateGalleryPosition();
    }
  }
  
  // Function to show previous page
  function showPreviousPage() {
    if (currentPage > 0) {
      currentPage--;
      updateGalleryPosition();
    }
  }
  
  // Function to update the gallery position
  function updateGalleryPosition() {
    const galleryWidth = gallery.offsetWidth;
    const itemWidth = galleryItems[currentPage].offsetWidth;
    const translateXValue = -currentPage * itemWidth;
  
    gallery.style.width = '${itemWidth * galleryItems.length}px';
  
    const maxTranslateXValue = -(itemWidth * (galleryItems.length - 1));
  
    gallery.style.transform = 'translateX(${Math.max(translateXValue, maxTranslateXValue)}px';
  
  }
  
  });

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".article-preview");
    const searchBox = document.querySelector("#searchBox");
  
    if (searchBox) {
      const links = Array.from(document.querySelectorAll("a")).filter(link => link.href.endsWith(".json"));
  
      const search = () => {
        const searchText = searchBox.value.trim().toLowerCase();
        const articles = container.querySelectorAll(".article");
      
        articles.forEach(article => {
          const articleSearchTerms = article.getAttribute("data-search").toLowerCase();
          if (searchText === "" || articleSearchTerms.includes(searchText)) {
            article.classList.remove("hidden");
          } else {
            article.classList.add("hidden");
          }
        });
      };
      
  
      searchBox.addEventListener("input", search);
  
      Promise.all(
        links
          .map(link => fetch(link.href)
            .then(response => response.json())
            .then(data => {
              data.fileName = link.href.match(/\/?([^/]+)$/)[1];
              return data;
            })
            .catch(error => console.error(`Error fetching article from ${link.href}:`, error))
          )
      ).then(articles => {
        articles = articles.flat();
  
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
  
          const articlePreview = document.createElement("div");
          articlePreview.className = "article-preview";
          articlePreview.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.snippet}</p>
            <button class="view-btn" data-href="${article.pdfUrl}">Read more</button>
          `;
          articlePreview.setAttribute("data-search", JSON.stringify(searchTerms));
  
          console.log(articlePreview.getAttribute("data-search"));
  
          container.appendChild(articlePreview);
        }
      })
      .catch(error => console.error('Error with Promise.all:', error));
  
      container.addEventListener("click", event => {
        if (event.target.classList.contains("view-btn")) {
          const pdfUrl = event.target.dataset.href;
          const pdfjsLib = window["pdfjs-dist/build/pdf"];
          pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
  
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
        }
      });
    }
  });
  
  function onPlayerReady(event) {
    event.target.playVideo();
  }
  
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      // Video is playing
    } else if (event.data == YT.PlayerState.PAUSED) {
      // Video is paused
    } else if (event.data == YT.PlayerState.ENDED) {
      // Video has ended
    }
  }
  
  function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('show');
  }
  
  function toggleSearch() {
    var searchBarContainer = document.querySelector('.search-bar-container');
    if (searchBarContainer) {
      searchBarContainer.classList.remove('hidden');
    }
    searchBarContainer.classList.toggle('show');
  }

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".article-preview");
    const searchBox3 = document.querySelector("#searchBox3");
  
    if (searchBox3) {
      const links = Array.from(document.querySelectorAll("a")).filter(link => link.href.endsWith(".json"));
  
      const search = (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          const searchText = searchBox3.value.trim().toLowerCase();
          const articles = container.querySelectorAll(".article");
      
          articles.forEach(article => {
            article.classList.add("hidden");
          });
      
          articles.forEach(article => {
            const articleSearchTerms = article.getAttribute("data-search").toLowerCase();
            if (searchText === "" || articleSearchTerms.includes(searchText)) {
              article.classList.remove("hidden");
            }
          });
      
          const searchResults = document.querySelector(".search-results");
          if (searchResults) {
            searchResults.classList.remove("hidden");
          }
          const searchContainer = document.querySelector(".search-bar-container");
          searchContainer.classList.add("hidden");
        }
      };
  
      searchBox3.addEventListener("keydown", search);
  
      Promise.all(
        links
          .map(link => fetch(link.href)
            .then(response => response.json())
            .then(data => {
              data.fileName = link.href.match(/\/?([^/]+)$/)[1];
              return data;
            })
            .catch(error => console.error(`Error fetching article from ${link.href}:`, error))
          )
      ).then(articles => {
        articles = articles.flat();
  
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
  
          const articlePreview = document.createElement("div");
          articlePreview.className = "article-preview";
          articlePreview.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.snippet}</p>
            <button class="view-btn" data-href="${article.pdfUrl}">Read more</button>
          `;
          articlePreview.setAttribute("data-search", JSON.stringify(searchTerms));
  
          console.log(articlePreview.getAttribute("data-search"));
  
          container.appendChild(articlePreview);
        }
      })
      .catch(error => console.error('Error with Promise.all:', error));
  
      container.addEventListener("click", event => {
        if (event.target.classList.contains("view-btn")) {
          const pdfUrl = event.target.dataset.href;
          const pdfjsLib = window["pdfjs-dist/build/pdf"];
          pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
  
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
        }
      });
    }
  });


