document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', fetchData);

  async function fetchData(baseURL) {
    let zip = document.getElementById('zip').value;
    let countryCode = document.getElementById('countryCode').value;
    let feelings = document.getElementById('feelings').value;
    let resultsDiv = document.getElementById('results');

    try {
      const response = await fetch('baseURL', {
        method: 'POST',
        credentials: 'same-origin',
        mode: cors,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ zip, feelings, countryCode })
      });

      if (response.ok) {
        throw error = new Error('Error fetching weather data');
      } else {
        const data = await response.json();
          console.log(data);
      }
    } catch (error) {
      console.error(error);
      resultsDiv.textContent = 'An error occurred. Please try again later.';
    }
  }

  function displayData(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
      <p>Date: ${data.date}</p>
      <p>Temperature: ${data.temperature}°C</p>
      <p>Humidity: ${data.humidity}</p>
      <p>Feelings: ${data.feelings}</p>
    `;
  }

  const addEntryBtn = document.querySelector('#generate').addEventListener('click', displayData);

});
