const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const spinner = document.querySelector(".spinner");

const VALUE_RANGE_MIN = 10;
const VALUE_RANGE_MAX = 100;
const TIME_RANGE = 1000 * 60 * 60 * 10;

function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

// Function for hiding the spinner after fetching data
function hideSpinner() {
  spinner.style.display = 'none';
}

// Function for fetching data
async function fetchData() {
  
  try {
    const stockNamesRes = await fetch('/stocks'); // Gets all stock symbols as a response
    const stockNamesData = await stockNamesRes.json();
    const stockSymbols = stockNamesData.stockSymbols;

    for (let i = 0; i < stockSymbols.length; i++) {
      const stockPointsRes = await fetch(`/stocks/${stockSymbols[i]}`); // Gets all stocks as a response

      if (!stockPointsRes.ok) {
        console.error(`Error fetching data for ${stockSymbols[i]}: ${stockPointsRes.status} - ${stockPointsRes.statusText}`); // Sends the error to console in Client-Side and contiunes to fetch other data
        continue;
      }

      const data = await stockPointsRes.json();

      console.log(stockSymbols[i], data); // Logs the data available
      for (let i = 0; i < data.length; i++) {
        drawChart(data);
      }
    }
    hideSpinner();
  } catch (error) {
    console.log('Error fetching data: ', error.message);
  }
}


function drawChart(data) {

  const xScale = (950 - 50); // Scales the timestamp to fit within the graph width
  const yScale = (550 - 50) / (VALUE_RANGE_MAX - VALUE_RANGE_MIN); // Scales the value to fit within the graph height

  const randomColor = getRandomColor(); // Gets a random color for graph line

  ctx.beginPath();
  ctx.strokeStyle = randomColor;
  ctx.lineWidth = 2;

  data.forEach(dataPoint => {

    const timestamp = dataPoint.timestamp;
    const value = dataPoint.value;

    const x = ((timestamp - Date.now() + TIME_RANGE) / TIME_RANGE * xScale) - 39; // Maps timestamp to x position inside the graph
    const y = 550 - (value - VALUE_RANGE_MIN) * yScale; // Maps value to y position inside the graph

    ctx.lineTo(x, y);
  });
  
  ctx.stroke();
}

// Function for getting a random rolor for each graph line
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])
fetchData();