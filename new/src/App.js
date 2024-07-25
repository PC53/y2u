import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Footer from './Footer';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);

  const downloadVideo = async (format) => {
    try {
      const response = await axios.get('http://localhost:5000/download', {
        params: {
          url: videoUrl
        },
        responseType: 'blob' // Important to handle the response as a Blob
      });
  
      // Create a URL for the blob and initiate a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'video.mp4'); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the video', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/info', { videoUrl });
      setVideoInfo(response.data);
      console.log(videoInfo);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      
      <div className="App">
        <header className="App-header">
            <h1>YouTube 2 You</h1>
          <form onSubmit={handleSubmit}>
            <input
              className='searchInput'
              type="text"
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              />
            <button type="submit" className='searchBtn'>Download</button>
          </form>
        </header> 
      
        {videoInfo && (
          <>
            <div className="Content"> 
              <h4>Download High-Quality Videos</h4>
              <form onSubmit={handleSubmit}>
              <input
              className='searchInput'
                type="text"
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button type="submit" className='searchBtn'>Download</button>
            </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}              

              <h2>Available Formats:</h2>
              <table>
              <thead>
                <tr>
                  <th>Quality</th>
                  <th>File Size</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {videoInfo.formats.map((format, index) => (
                  <tr key={index}>
                    <td>{format.qualityLabel}</td>
                    <td>{format.sizeInMB}</td>
                    <td><button onClick={() => downloadVideo(format)}>Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
        
            </div>
          </>
        
        )}

        <Footer />
      </div>
    </>
  );
}

export default App;
