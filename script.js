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
  console.log("DOMContentLoaded event fired");

  const searchBox = document.querySelector("#searchBox");
  const container = document.getElementById("articles");
  const suggestions = document.getElementById("suggestions");

  const pattern = /\.json$/; // Match all files that end with .json
  const url = '.'; // The URL of the current directory
  const articles = [];

  fetch(url)
    .then(response => response.text())
    .then(text => {
      const parser = new DOMParser();
      const html = parser.parseFromString(text, 'text/html');
      const links = html.querySelectorAll('a');
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.getAttribute('href');
        if (pattern.test(href)) {
          fetch(href)
            .then(response => response.json())
            .then(data => {
              // Add the file name as a property to each article object
              data.fileName = href.match(/\/?([^/]+)$/)[1];

              articles.push(data);
              console.log(`Fetched article from ${href}`);
            })
            .catch(error => console.error(`Error fetching article from ${href}:`, error));
        }
      }

      // Add an event listener to the search input to filter and sort the articles based on the user's input
      searchBox.addEventListener("input", filterArticles);

      // Define a function to filter and sort the articles based on the user's input
      function filterArticles() {
        console.log('filterArticles called');
        const input = searchBox.value.trim().toUpperCase();
        const articlePreviews = container.getElementsByClassName("article-preview");

        // Loop through all the article preview elements
        for (let i = 0; i < articlePreviews.length; i++) {
          const articlePreview = articlePreviews[i];
          const searchTerms = articlePreview.getAttribute("data-search").toUpperCase();
          const relevanceScore = getRelevanceScore(input, searchTerms);
          articlePreview.style.display = relevanceScore > 0 ?"block" : "none";
          articlePreview.style.order = relevanceScore > 0 ? -relevanceScore : 0;
        }

        // Display the suggestions based on the user's input
        displaySuggestions(input);
      }

      // Define a function to calculate the relevance score of an article based on the user's input and its search terms
      function getRelevanceScore(input, searchTerms) {
        let score = 0;
        const inputWords = input.split(" ");
        const searchWords = searchTerms.split(" ");

        // Loop through all the input words and search words and calculate the relevance score
        for (let i = 0; i < inputWords.length; i++) {
          const inputWord = inputWords[i];

          for (let j = 0; j < searchWords.length; j++) {
            const searchWord = searchWords[j];

            if (searchWord.startsWith(inputWord)) {
              score += inputWord.length;
            }
          }
        }

        return score;
      }

      // Define a function to display the suggestions based on the user's input
      function displaySuggestions(input) {
        suggestions.innerHTML = "";

        if (input.length > 0) {
          const matchingArticles = articles.filter(article =>
            article.searchTerms.some(searchTerm =>
              searchTerm.toUpperCase().startsWith(input)
            )
          );

          const matchingSearchTerms = matchingArticles.flatMap(article =>
            article.searchTerms.filter(searchTerm =>
              searchTerm.toUpperCase().startsWith(input)
            )
          );

          const uniqueMatchingSearchTerms = [...new Set(matchingSearchTerms)];

          for (let i = 0; i < uniqueMatchingSearchTerms.length; i++) {
            const suggestion = document.createElement("div");
            suggestion.className = "suggestion";
            suggestion.textContent = uniqueMatchingSearchTerms[i];
            suggestions.appendChild(suggestion);
          }
        }
      }

      // Wait for all the articles to be fetched, then create an article preview element for each one
      Promise.all(articles)
        .then(data => {
          // Flatten the arrays of articles into a single array
          const articles = data.flat();

          // Loop through the array of articles and create an article preview element for each one
          for (let i = 0; i < articles.length; i++) {
            const article = articles[i];

            // Create the article preview element
            const articlePreview = document.createElement("div");
            articlePreview.className = "article-preview";
            articlePreview.innerHTML = `
              <h2>${article.title}</h2>
              <p>${article.snippet}</p>
              <p>${article.author}</p>
              <button class="view-btn" href="${article.pdfUrl}">Read more</a>
            `;
            // Add a data-search attribute to the article preview element to store the search terms
            articlePreview.setAttribute("data-search", `${article.title} ${article.snippet} ${article.pdfUrl}`.toUpperCase());

            // Add the article preview element to the container
            container.appendChild(articlePreview);
          }
        }) .catch(error => console.error('Error with Promise.all:', error));
}) .catch(error => console.error('Error fetching data:', error));
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
  searchBarContainer.classList.toggle('show');
}