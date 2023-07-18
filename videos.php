<?php
$dir = '/risk-engineering-aon/'; // Directory containing the raw video files
$videos = array();

// Open the directory and loop through its contents
if ($handle = opendir($dir)) {
    while (false !== ($file = readdir($handle))) {
        // Check if the file is a video file
        if (preg_match('/\.(mp4|avi|mov)$/', $file)) {
            // Get the file path and video ID
            $filePath = $dir . '/' . $file;
            $videoId = pathinfo($file, PATHINFO_FILENAME);

            // Get the video duration and thumbnail image using FFmpeg
            $output = shell_exec("ffmpeg -i $filePath -ss 00:00:01.000 -vframes 1 -vf scale=120:-1 -f image2pipe -");
            $thumbnail = base64_encode($output);
            $duration = shell_exec("ffmpeg -i $filePath 2>&1 | grep 'Duration' | cut -d ' ' -f 4 | sed s/,//");

            // Add the video information to the array
            $videos[] = array(
                'id' => $videoId,
                'title' => $videoId,
                'description' => '',
                'thumbnail' => $thumbnail,
                'duration' => $duration
            );
        }
    }
    closedir($handle);
}

// Output the video information as JSON
echo json_encode($videos);
?>