import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(0);
  const [speedData, setSpeedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://speedometer-backend.onrender.com/api/speed');
        const latestSpeed = response.data[0]?.speed || 0;
        setSpeed(latestSpeed);
        setSpeedData(response.data);
      } catch (error) {
        console.error('Error fetching speed data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateSpeed = async (newSpeed) => {
    try {
      await axios.post('https://speedometer-backend.onrender.com/api/speed', { speed: newSpeed });
      setSpeed(newSpeed);
      localStorage.setItem('speed', newSpeed.toString());
    } catch (error) {
      console.error('Error updating speed:', error);
    }
  };

  const handleAccelerate = () => {
    const newSpeed = Math.min(speed + 10, 180); // Increase speed by 10, capped at 180 km/h
    handleUpdateSpeed(newSpeed);
  };

  const handleBrake = () => {
    const newSpeed = Math.max(speed - 10, 0); // Decrease speed by 10, minimum speed is 0 km/h
    handleUpdateSpeed(newSpeed);
  };

  const handleStoreSpeed = async () => {
    try {
      await axios.post('https://speedometer-backend.onrender.com/api/speed', { speed });
      // Refresh speed data after storing
      const response = await axios.get('https://speedometer-backend.onrender.com/api/speed');
      setSpeedData(response.data);
    } catch (error) {
      console.error('Error storing speed:', error);
    }
  };

  return (
    <div className="container">
      <div className="speedometer">
        <div className="needle" style={{ transform: `rotate(${(speed / 180) * 180}deg)` }}></div>
        <h1 className="speed-text">Current Speed: {speed} km/h</h1>
        <div className="buttons">
          <button onClick={handleAccelerate}>Accelerate</button>
          <button onClick={handleBrake}>Brake</button>
          <button onClick={handleStoreSpeed}>Store Speed</button>
        </div>
      </div>
      <div className="speed-table">
        <h2>Speed Data Table</h2>
        <table>
          <thead>
            <tr>
              <th>Speed (km/h)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {speedData.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.speed}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
