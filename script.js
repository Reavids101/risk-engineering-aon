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

  // Define an array of file names for the articles data
  const files = ["Wellington Letter September 7, 2020.json",
  "Steam Explosions.json",
  "US CSB 2020 Hurricane Season_Guidance for Chemical Plants During Extreme Weather Events.json",
  "AIM Learning Series 2.0.json",
  "alternative-heating.json",
  "Aon Hurricane Season Preparation and Response 2020.json",
  "NFPA 70B Checklist NATURAL DISASTER ELECTRICAL EQUIPMENT.json",
  "Management Of Change MOC.json",
  "icheme-lessons-learned-database.json",
  "IBHS-Small Hail-Big Problems-New Approach 20230419.json",
  "Hazards of High Oxygen Concentration_English.json",
  "Get Help.lnk.json",
  "Freezing-Weather-Last-Minute-Checklist_IBHS.json",
  "Freezing-Bursting-Pipes_IBHS.json",
  "FreezeTips.json",
  "Combustible Mists_English.json",
  "Automatic vs Manual control.json",
  "202201beaconenglish-PID.json"];

  // Fetch the contents of all the files and process the data
  Promise.all(files.map(file => fetch(file)))
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      // Flatten the arrays of articles into a single array
      const articles = data.flat();

      // Loop through the array of articles and create an article preview element for each one
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];

        // Create the article preview element
        const articlePreview = document.createElement("div");
        articlePreview.className = "article-preview";
        articlePreview.setAttribute("data-search", article.searchTerms.join(" "));

        // Create the title element
        const titleElem = document.createElement("h2");
        titleElem.textContent = article.title;
        articlePreview.appendChild(titleElem);

        // Create the author element
        const authorElem = document.createElement("div");
        authorElem.className = "author";
        authorElem.textContent = article.author;
        articlePreview.appendChild(authorElem);

        // Create the snippet element
        const snippetElem = document.createElement("div");
        snippetElem.className = "snippet";
        snippetElem.textContent = article.snippet;
        articlePreview.appendChild(snippetElem);

        // Create the view button
        const viewBtn = document.createElement("a");
        viewBtn.className = "view-btn";
        viewBtn.href = "#";
        viewBtn.textContent = "View Article";
        articlePreview.appendChild(viewBtn);

        // Append the article preview element to the container
        container.appendChild(articlePreview);
      }

      // Add an event listener to the search input to filter and sort the articles based on the user's input
      searchBox.addEventListener("input", filterArticles);

      // Define a function to filter and sort the articles based on the user's input
      function filterArticles() {
        const input = searchBox.value.trim().toUpperCase();
        const articlePreviews = container.getElementsByClassName("article-preview");

        // Loop through all the article preview elements
        for (let i = 0; i < articlePreviews.length; i++) {
          const articlePreview = articlePreviews[i];
          const searchTerms = articlePreview.getAttribute("data-search").toUpperCase();
          const relevanceScore = getRelevanceScore(input, searchTerms);
          articlePreview.style.display = relevanceScore > 0 ? "block" : "none";
          articlePreview.setAttribute("data-relevance", relevanceScore);
        }

        // Sort the article preview elements based on their relevance score
        const sortedArticlePreviews = Array.from(articlePreviews).sort((a, b) => {
          const aRelevance = parseInt(a.getAttribute("data-relevance"));
          const bRelevance = parseInt(b.getAttribute("data-relevance"));
          return bRelevance - aRelevance;
        });

        // Remove all existing article preview elements from the container
        while (container.firstChild) {
          container.removeChild(container.lastChild);
        }

        // Append the sorted article preview elements to the container
        for (let i = 0; i < sortedArticlePreviews.length; i++) {
          const articlePreview = sortedArticlePreviews[i];
          container.appendChild(articlePreview);
        }

        // Generate a list of suggestions based on the available search terms
        const searchTerms = container.getAttribute("data-search");
        const matchingTerms = searchTerms ? searchTerms.split(" ").filter(term => term.toUpperCase().indexOf(input) > -1) : [];

        suggestions.innerHTML = "";
        matchingTerms.forEach(term => {
          const option = document.createElement("option");
          option.value = term;
          suggestions.appendChild(option);
        });
      }

      // Define a function to calculate the relevance score for an article preview element
      function getRelevanceScore(query, searchTerms) {
        const queryWords = query.split(" ");
        const searchTermWords = searchTerms.split(" ");
        let score = 0;

        for (let i = 0; i < queryWords.length; i++) {
          for (let j = 0; j < searchTermWords.length; j++) {
            if (searchTermWords[j].startsWith(queryWords[i])) {
              score += queryWords[i].length;
            }
          }
        }

        return score;
      }
    })
    .catch(error => console.error(error));
  });