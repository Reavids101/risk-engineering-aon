const element = document.querySelector('.gallery-item');
element.classList.add('animate-slide-up');

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