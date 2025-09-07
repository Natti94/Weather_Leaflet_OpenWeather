import { useState, useEffect } from "react";
import Map from "./components/Map/map";
import Favourite from "./components/Favourite/favourite";
import Location from "./components/Location/location";
import Weather from "./components/Weather/weather";
import { WeatherData } from "./Services/Weather/weather";
import "leaflet/dist/leaflet.css";
import "./global.css";

function App() {
  const [searchInput, setSearchInput] = useState(null);
  const [markedPosition, setMarkedPosition] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [locationFetched, setLocationFetched] = useState(false);
  const addToFavourites = (locationData) => {
    setFavourites((prev) => [...prev, { ...locationData, id: Date.now() }]);
  };
  const removeFromFavourites = (id) => {
    setFavourites((prev) => prev.filter((fav) => fav.id !== id));
  };
  const updateFavourites = async () => {
    if (favourites.length === 0) {
      return;
    }
    const updatedFavourites = await Promise.all(
      favourites.map(async (fav) => {
        if (!fav.lat || !fav.lon) return fav;
        try {
          const weather = await WeatherData(fav.lat, fav.lon);
          if (weather) {
            return {
              ...fav,
              temp: weather.main.temp,
              description: weather.weather[0].description,
              icon: weather.weather[0].icon,
              timestamp: Math.floor(Date.now() / 1000),
            };
          }
          return fav;
        } catch {
          return fav;
        }
      })
    );
    setFavourites(updatedFavourites);
  };
  useEffect(() => {
    if (searchInput) {
      setMarkedPosition(searchInput);
    }
  }, [searchInput]);
  return (
    <div className="Page">
      <div className="Map">
        <Map
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          markedPosition={markedPosition}
          setMarkedPosition={setMarkedPosition}
          setMyPosition={setMyPosition}
          myPosition={myPosition}
        />
      </div>
      <div className="Favourite">
        <button
          type="button"
          onClick={() =>
            favourites.length > 0 && removeFromFavourites(favourites[0].id)
          }
        >
          🗑️
        </button>
        <button type="button" onClick={updateFavourites}>
          🔃
        </button>
        <Favourite favourites={favourites} />
      </div>
      <div className="Weather">
        <Location
          setMyPosition={setMyPosition}
          setLocationFetched={setLocationFetched}
        />
        <Weather
          markedPosition={markedPosition}
          addToFavourites={addToFavourites}
          myPosition={myPosition}
          locationFetched={locationFetched}
        />
      </div>
    </div>
  );
}

export default App;
