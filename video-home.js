var player;
var videoFeedElement = document.getElementById('video-feed');
var searchBoxElement = document.getElementById('searchBox1');

// Define your video objects manually
var videos = [
    {
        id: 'Grenfell Tower panels cladding fire tests',
        title: 'Grenfell Tower panels cladding fire tests',
    },
    {
        id: 'Perfume fire_static charges',
        title: 'Perfume fire_static charges',
    },
    // Add more video objects as needed
];

var promises = videos.map(function(video) {
    var videoElement = document.createElement('video');
    videoElement.setAttribute('src', video.id + '.mp4');
    videoElement.setAttribute('type', 'video/mp4');
    videoElement.setAttribute('controls', '');

    var titleElement = document.createElement('h2');
    titleElement.textContent = video.title;

    var videoContainerElement = document.createElement('div');
    videoContainerElement.appendChild(titleElement);
    videoContainerElement.appendChild(videoElement);

    videoFeedElement.appendChild(videoContainerElement);
});

Promise.all(promises).then(function() {
    console.log('videos:', videos);
    onVideoPlayerReady(videos);
});

function onVideoPlayerReady(videosList) {
    if (videosList && videosList.length > 0) {
        player = videoFeedElement.children[0].getElementsByTagName('video')[0];
        player.addEventListener('ended', onVideoPlayerEnded);
    } else {
        console.error('No videos found');
    }
}

function onVideoPlayerEnded(event) {
    // Play the next video
    var nextVideo = event.target.parentNode.nextElementSibling;
    if (nextVideo) {
        nextVideo.getElementsByTagName('video')[0].play();
    }
}

// Format video duration from ISO 8601 format to hh:mm:ss
function formatDuration(duration) {
    var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    var hours = (parseInt(match[1]) || 0);
    var minutes = (parseInt(match[2]) || 0);
    var seconds = (parseInt(match[3]) || 0);

    var totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;

    var formattedDuration = '';

    if (hours > 0) {
        formattedDuration += hours + ':';
    }

    if (minutes < 10) {
        formattedDuration += '0';
    }
    formattedDuration += minutes + ':';

    if (seconds < 10) {
        formattedDuration += '0';
    }
    formattedDuration += seconds;

    return formattedDuration;
}

// Search function to filter videos by keyword in id or title
function searchBox1() {
    var query = searchBoxElement.value.toLowerCase();

    var filteredVideos = videos.filter(function(video) {
        var idMatch = video.id.toLowerCase().indexOf(query) >= 0;
        var titleMatch = video.title.toLowerCase().indexOf(query) >= 0;
        return idMatch || titleMatch;
    });

    // Clear existing videos
    videoFeedElement.innerHTML = '';

    // Add filtered videos to video feed
    var promises = filteredVideos.map(function(video) {
        var videoElement = document.createElement('video');
        videoElement.setAttribute('src', video.id + '.mp4');
        videoElement.setAttribute('type', 'video/mp4');
        videoElement.setAttribute('controls', '');

        var titleElement = document.createElement('h2');
        titleElement.textContent = video.title;

        var videoContainerElement = document.createElement('div');
        videoContainerElement.appendChild(titleElement);
        videoContainerElement.appendChild(videoElement);

        videoFeedElement.appendChild(videoContainerElement);
    });

    Promise.all(promises).then(function() {
        console.log('filtered videos:', filteredVideos);
        onVideoPlayerReady(filteredVideos);
    });
}

searchBoxElement.addEventListener('input', searchBox1);