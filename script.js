const element = document.querySelector('.gallery-item');
element.classList.add('animate-slide-up');

// Get necessary elements
const gallery = document.querySelector('.gallery');
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
  if (currentPage < 4) { // Assuming you have 5 items in total
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
  gallery.style.transform = `translateX(-${currentPage * 100}%)`;
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
  for (let i = 0; i < 5; i++) { // Assuming you have 5 items in total
    const circle = document.createElement('span');
    pagination.appendChild(circle);
  }
}

// Initialize the carousel
generatePaginationCircles();
updatePagination();



function loadYouTubeAPI() {
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api?api_key=AIzaSyB8PZzheb2PUkyrFwBdDA4SoYGRS8p8kLQ";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

function onYoutubeIframeAPIReady() {
    new YT.Player('youtube-player', {
        width: '640',
        height: '390',
        videoId: 'VIDEO_ID',
        playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            loop: 1
        },
        events: {
            onReady: onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
}

window.onload = loadYouTubeAPI

async function fetchMultipleVideoDetails(videoIds) {

    try {
        const videoDetails=[];

        for (const videoId of videoIds) {
            const response = await fetch ('https://graph.microsoft.com/v1.0/me/drive/items${videoId}', {
                headers: {
                    'Authorization': 'Bearer ${accessToken}'
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching video details for video ID: ${videoId}');
            }
            const data = await response.json();
            const videoName = data.name;
            const videoThumbnailUrl = data.thumbnailUrl;

            videoDetails.push({ videoId, videoName, videoThumbnailUrl });
        }
        return videoDetails;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function displayVideoThumbnails() {
    try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/items/{folder-id}/children?$filter=video', {
        headers: {
            'Authorization': 'Bearer ${accessToken)'
        }
    });

    if (!response.ok) {
        throw new Error('Error fetchingvideo IDs');
    }

    const data = await response.json();
    const videoIds = data.value.map(video => video.id);
    const videoDetails= await fetchMultipleVideoDetails(videoIds);
    const thumbnailContainer = document.getElementById('thumbnail-container');
    videoDetails.forEach(video => {
        const thumbnailElement = document.createElement('div');
        thumbnailElement.classList.add('thumbnail');
        thumbnailElement.innerHTML = '<img src="$(video.videoThumbnailUrl}" alt="${video.videoName}"> <p>${video.videoName}</p>';
        thumbnailContainer.appendChild(thumbnailElement);
    });   

} catch (error) {
    console.error('Error:', error);
}
}

displayVideoThumbnails();