document.addEventListener('DOMContentLoad', function() {
  
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
gallery.addEventListener('touchstart', handleTouchStart);
gallery.addEventListener('touchmove', handleTouchMove);

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

  updatePagination();
}

// Function to update pagination circles
function updatePagination() {
  const circles = pagination.querySelectorAll('span');
  circles.forEach((circle, index) => {
    if (index === currentPage) {
      circle.classList.add('active');
    } else {
      circle.classList.remove('active');
    }
  });
}

// Generate pagination circles based on the number of items
function generatePaginationCircles() {
  for (let i = 0; i < galleryItems.length; i++) {
    const circle = document.createElement('span');
    pagination.appendChild(circle);
  }
}

// Initialize the carousel
generatePaginationCircles();
updatePagination();

});

function filterArticles() {
  const container = document.getElementById("articles");
  const input = document.getElementById("searchBox").value.toUpperCase();
  const articles = container.getElementsByClassName("article-preview");
  const suggestions = document.getElementById("suggestions");

  // Loop through all the article preview elements
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const searchString = article.getAttribute("data-search").toUpperCase();

    // Calculate the relevance score of the article based on the search term
    const relevanceScore = searchString.split(input).length - 1;
    console.log(`Article ${i}: relevance score = ${relevanceScore}, search term = ${input}`);

    // If the search string is found, show the article preview, otherwise hide it
    if (relevanceScore > 0) {
      article.style.display = "";
    } else {
      article.style.display = "none";
    }

    // Set the data-relevance attribute of the article to its relevance score
    article.setAttribute("data-relevance", relevanceScore);
  }

  // Sort the article preview elements based on their relevance score
  const sortedArticles = Array.from(articles).sort((a, b) => {
    const aRelevance = parseInt(a.getAttribute("data-relevance"));
    const bRelevance = parseInt(b.getAttribute("data-relevance"));
    return bRelevance - aRelevance;
  });

  // Append the sorted article preview elements to the container
  sortedArticles.forEach(article => container.appendChild(article));

  // Generate a list of suggestions based on the available search terms
  const searchTerms = container.getAttribute("data-search").split(" ");
  const matchingTerms = searchTerms.filter(term => term.toUpperCase().indexOf(input) > -1);
  suggestions.innerHTML = "";
  matchingTerms.forEach(term => {
    const option = document.createElement("option");
    option.value = term;
    suggestions.appendChild(option);
  });
}