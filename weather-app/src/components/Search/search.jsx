import { useState } from "react";
import { SearchData } from "../../services/search/search"
import "./search.css";

function Search({ setSearchInput, setMarkedPosition }) {
  const [query, setQuery] = useState("");
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const data = await SearchData(query);
    if (data) {
      setSearchInput({ lat: data.lat, lng: data.lon });
      setMarkedPosition({ lat: data.lat, lng: data.lon });
    } else {
      alert("Location not found!");
    }
  }
  return (
    <form onSubmit={handleSearch}>
      <input
        className="search"
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export default Search;