// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [item, setItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch new random dog image with breed information
  const fetchNewItem = async () => {
    try {
      const response = await fetch(`https://api.thedogapi.com/v1/images/search`, {
        headers: {
          'x-api-key': 'live_E6NKGqzMx8iBDYNxlxpIjWIkyjpXotgAMgB4Ay7OHaDh56EFFQith5Tljg1fRVKc'
        }
      });
      const data = await response.json();

      // Ensure we get images with breed information
      if (data[0]?.breeds.length > 0) {
        // Check if the breed is in the ban list
        if (banList.some(attr => data[0]?.breeds[0]?.name && attr === data[0]?.breeds[0]?.name)) {
          fetchNewItem();  // Fetch again if the breed is in the ban list
        } else {
          setItem(data[0]);
          // Add the item to history if it exists
          setHistory(prev => [...prev, data[0]]);
        }
      } else {
        // If no breed information, fetch another image
        fetchNewItem();
      }
    } catch (error) {
      console.error("Error fetching new item: ", error);
    }
  };

  // Handle adding a breed to the ban list
  const addToBanList = (attribute) => {
    setBanList([...banList, attribute]);
  };

  // Handle removing a breed from the ban list
  const removeFromBanList = (attribute) => {
    setBanList(banList.filter(attr => attr !== attribute));
  };

  // Fetch a new item on load
  useEffect(() => {
    fetchNewItem();
  }, []);

  return (
    <div className="app-container">
      {/* History Section */}
      <div className="history-list">
        <h3>Previous Dogs</h3>
        {history.map((dog, index) => (
          <p key={index}>{dog.breeds[0]?.name || "Unknown Breed"}</p>
        ))}
      </div>

      {/* Main Display */}
      {item ? (
        <div className="item-display">
          <h2>{item.breeds[0]?.name || "Unknown Breed"}</h2>
          <img src={item.url} alt={item.breeds[0]?.name || "Dog"} className="dog-image" />
          
          {/* Dog Facts Section */}
          {item.breeds.length > 0 && (
            <div className="dog-facts">
              <p><strong>Temperament:</strong> {item.breeds[0].temperament}</p>
              <p><strong>Origin:</strong> {item.breeds[0].origin}</p>
              <p><strong>Weight:</strong> {item.breeds[0].weight.imperial} lbs</p>
              <p><strong>Life Span:</strong> {item.breeds[0].life_span} years</p>
            </div>
          )}

          <div className="attributes">
            {item.breeds.length > 0 && (
              <span onClick={() => addToBanList(item.breeds[0]?.name)}>
                Ban: {item.breeds[0]?.name}
              </span>
            )}
          </div>

          {/* Centered Discover Button */}
          <button className="discover-button" onClick={fetchNewItem}>Discover New Dog</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Ban List */}
      <div className="ban-list">
        <h3>Ban List</h3>
        {banList.map((ban, index) => (
          <button key={index} onClick={() => removeFromBanList(ban)}>
            {ban} ✕
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;