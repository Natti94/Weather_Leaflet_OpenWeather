import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import Click from "../Click/click";
import Mark from "../marker/marker";
import Search from "../search/search";

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);
  return null;
}
function Map({ markedPosition, setMarkedPosition, setSearchInput, setMyPosition, myPosition }) {
  const [localPosition, setLocalPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    if (myPosition) {
      setLocalPosition(myPosition);
    }
  }, [myPosition]);
  return (
    <MapContainer center={localPosition} zoom={5}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      <MapUpdater position={myPosition || localPosition} />
      <Click setMarkedPosition={setMarkedPosition} />
      <Mark markedPosition={markedPosition} />
      <Search setSearchInput={setSearchInput} setMarkedPosition={setMarkedPosition} />
    </MapContainer>
  );
}

export default Map;