import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
const SearchBox = () => {
  const [searchVal, setSearchVal] = useState("");
  const { push } = useNavigate();

  const handleChange = e => {
    const { value } = e.target;
    setSearchVal(value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    let term = searchVal.trim();
    setSearchVal("");
    if (term)
      push(`/results?term=${term}`);
  }

  useEffect(() => {
    console.debug(
      "SearchBox",
      "search=", typeof search,
      "searchVal=", searchVal,
    );
  })

  return (
    <Box className="flex-grow-1" onSubmit={handleSubmit}>
      <TextField>
        <Box.Control
          type="search"
          className="flex-grow-1"
          placeholder="Search for news, symbols, and companies..."
          name="searchVal"
          value={searchVal}
          onChange={handleChange}
        />
        <Button type="submit" variant="outline-success">Search</Button>
      </TextField>
    </Box>
  )
}

export default SearchBox;