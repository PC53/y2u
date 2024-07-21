const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
    const videoURL = req.body.url;
    console.log('Post request for :', videoURL);
    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send('Invalid URL');
    }
    try {
        const info = await ytdl.getInfo(videoURL);
        console.log('Info:', info.videoDetails.title);
        console.log('duration', info.videoDetails.lengthSeconds);
        console.log('category', info.videoDetails.category);
        console.log('ID', info.videoDetails.videoId);
        console.log('url', info.videoDetails.video_url);
        const formats = info.formats || [];
        formats.forEach(element => {
            console.log('Format:', element.qualityLabel);
        });
        
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Failed to download video. Please check the URL and try again.');
    }

    // const outputFilePath = './abc.mp4';
    // ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ').pipe(fs.createWriteStream('video.mp4'));
    // console.log('Download complete');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
