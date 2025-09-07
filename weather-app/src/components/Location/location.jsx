import { useState } from "react";
import { getUserLocation } from "../../services/location/location";

function Location({ setMyPosition, setLocationFetched }) {
  const [loading, setLoading] = useState(false);
  const getLocation = () => {
    setLocationFetched(false);
    setLoading(true);
    getUserLocation(setMyPosition, setLoading, setLocationFetched);
  };
  return (
    <div>
      <button onClick={getLocation} disabled={loading}>
        {loading ? "Fetching Location..." : "Get My Location"}
      </button>
    </div>
  );
}

export default Location;