"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rollNumber, setRollNumber] = useState(''); 

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  
  useEffect(() => {
    const fetchRollNumber = async () => {
      try {
        const res = await axios.get('http://localhost:3000/bfhl');
        setRollNumber(res.data.roll_number || 'Unknown Roll Number');
        document.title = res.data.roll_number || 'Default Title';
      } catch (err) {
        console.error('Error fetching roll number:', err);
        setError('Could not fetch roll number');
      }
    };

    fetchRollNumber();
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
  
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format. Make sure it includes an array under the 'data' key.");
      }
  
      const res = await axios.post('https://bajaj-3-9d33.onrender.com/bfhl', parsedInput);
  
      setResponse(res.data);
      setError(null);
    } catch (err) {
     
      if (err instanceof SyntaxError) {
        setError("Please input valid JSON data.");
      } else {
        setError(err.message);
      }
     
      setResponse(null);
    }
  };
  

  const renderResponse = () => {
    if (!response) return null;

    let filteredResponse = {};
    if (selectedOptions.find(opt => opt.value === 'alphabets')) filteredResponse.alphabets = response.alphabets;
    if (selectedOptions.find(opt => opt.value === 'numbers')) filteredResponse.numbers = response.numbers;
    if (selectedOptions.find(opt => opt.value === 'highest_lowercase_alphabet')) filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;

    return (
      <div>
        <h4>Filtered Response</h4>
        {filteredResponse.alphabets && <p>Alphabets: {filteredResponse.alphabets.join(',')}</p>}
        {filteredResponse.numbers && <p>Numbers: {filteredResponse.numbers.join(',')}</p>}
        {filteredResponse.highest_lowercase_alphabet && <p>Highest Lowercase Alphabet: {filteredResponse.highest_lowercase_alphabet.join(',')}</p>}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Roll Number: {rollNumber}</h1>
      <p>As I am using free instance it will spin down with inactivity, which can delay requests by 50 seconds or more.Please send the api request and re-submit after 50 second</p>
      <div className="input-container">
        <label htmlFor="json-input">API Input</label>
        <textarea
          id="json-input"
          rows="4"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data":[]}'
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>

      {error && <p className="error">{error}</p>}

      {response && (
        <>
          <div className="select-container">
            <label htmlFor="multi-select">Multi Filter</label>
            <Select
              id="multi-select"
              isMulti
              value={selectedOptions}
              onChange={setSelectedOptions}
              options={options}
            />
          </div>
          {renderResponse()}
        </>
      )}
    </div>
  );
}
