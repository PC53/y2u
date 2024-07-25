import React, { useEffect } from "react";
import "./SearchResults.css";

function SearchResults({ url }) {

    useEffect(() => {
        console.log("URL:", url);
    }, [url]);
    return (
        <>
            <h1>Search Results</h1>
        </>
    );
}

export default SearchResults;