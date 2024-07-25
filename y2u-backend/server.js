const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

function filterMp4Formats(formats) {
    const mp4Formats = formats.filter(format => format.container === "mp4" && format.hasVideo && format.qualityLabel !== null).map(format => {
        const contentLength = parseInt(format.contentLength, 10); // Convert contentLength to integer
        const sizeInMB = contentLength / (1024 *1024);
        
        return {
            fps: format.fps,
            quality: format.quality,
            qualityLabel: format.qualityLabel,
            url: format.url,
            sizeInMB: sizeInMB.toFixed(2),
        };
    });

    return mp4Formats;
}

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    console.log('Get request for :', videoUrl);
    if (!videoUrl) {
      return res.status(400).send('No URL provided');
    }
  
    try {
      const info = await ytdl.getInfo(videoUrl);
      const videoTitle = info.videoDetails.title;
      res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
        ytdl(videoUrl, { format: 'mp4' }).pipe(fs.createWriteStream('video.mp4'));
        res.end();
    } catch (err) {
      res.status(500).send('Error downloading video');
    }
  
});
  

app.post('/info', async (req, res) => {
    const videoURL = req.body.videoUrl;
    
    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send('Invalid URL');
    }
    console.log('Post request for :', videoURL);
    try {

        const info = await ytdl.getInfo(videoURL);
        // Filter formats to include only those with container "mp4"
        const mp4Formats = filterMp4Formats(info.formats);
        // const mp4Formats = info.formats;
        
        res.json({
            title: info.videoDetails.title,
            duration: info.videoDetails.lengthSeconds,
            thumbnail: info.videoDetails.thumbnails[0].url,
            category: info.videoDetails.category,
            videoId: info.videoDetails.videoId,
            url: info.videoDetails.video_url,
            formats: mp4Formats, // Use the filtered formats
        });
        
        console.log('Info:', info.videoDetails.title);
        
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Failed to fetch information video. Please check the URL and try again.');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
