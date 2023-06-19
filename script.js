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
            const data = awaiot response.json();
            const videoName = data.name;
            const videoThumbnailUrl = data.thumbnailUrl;

            videoDetails.push({ videoId, videoName, videoThumbnailUrl });
        }
        return videoDetails;
    } catch (error) {
        console.error('Error:', error);
        return [;]
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