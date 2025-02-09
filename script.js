// Weather Widget using OpenWeatherMap API
const weatherInfo = document.getElementById('weather-info');
const openWeatherKey = 'c0748d260d9f2da259033043abc18550';  
const city = 'Bengaluru';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}&units=metric`)
  .then(response => response.json())
  .then(data => {
    weatherInfo.innerHTML = `Weather in ${city}: ${data.weather[0].description}, ${data.main.temp}°C`;
  })
  .catch(error => {
    console.error('Error fetching weather:', error);
    weatherInfo.innerHTML = 'Unable to load weather.';
  });

const recipeSearchInput = document.getElementById('recipe-search');
const recipeResults = document.getElementById('recipe-results');

// Recipe Search using TheMealDB API

recipeSearchInput.addEventListener('keyup', function(e) {
  const query = e.target.value;
  if (query.length > 2) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(response => response.json())
      .then(data => displayRecipes(data.meals))
      .catch(error => console.error('Error fetching recipes:', error));
  }
});

function displayRecipes(meals) {

  recipeResults.innerHTML = '';
  if (!meals) {
    recipeResults.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  meals.forEach(meal => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card mb-3">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
        </div>
      </div>
    `;
    recipeResults.appendChild(col);
  });
  recipeResults.style.display = 'block';
}

// Barcode Scanning with Camera Preview
document.addEventListener('DOMContentLoaded', function () {
  const scanButton = document.createElement('button');
  scanButton.innerText = 'Start Scan';
  scanButton.className = 'btn btn-primary';
  scanButton.onclick = startBarcodeScanner;
  document.getElementById('scanner-container').appendChild(scanButton);
});

function startBarcodeScanner() {
  const scannerContainer = document.getElementById('scanner-container');
  scannerContainer.classList.remove('d-none');
  
  if (!document.querySelector('#scanner-video')) {
    const videoElement = document.createElement('video');
    videoElement.id = 'scanner-video';
    videoElement.style.width = '100%';
    scannerContainer.appendChild(videoElement);
  }

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner-video'),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["ean_reader", "upc_reader", "code_128_reader"]
    }
  }, function (err) {
    if (err) {
      console.error('Quagga initialization error:', err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function (result) {
    const barcode = result.codeResult.code;
    document.getElementById('barcode-text').innerText = `Detected Barcode: ${barcode}`;
    console.log('Barcode detected:', barcode);
    stopBarcodeScanner();
  });
}

function stopBarcodeScanner() {
  Quagga.stop();
  document.getElementById('scanner-container').classList.add('d-none');
}

// Add Items to Pantry, Fridge, and Freezer
function addItem(category) {
  const inputField = document.getElementById(`${category}-input`);
  const itemList = document.getElementById(`${category}-items`);

  if (!inputField || !itemList) {
    console.error(`Invalid category: ${category}`);
    return;
  }

  if (inputField.value.trim() === '') {
    alert('Please enter an item name!');
    return;
  }

  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.innerHTML = `
    ${inputField.value}
    <button class="btn btn-danger btn-sm" onclick="removeItem(this)">Remove</button>
  `;
  itemList.appendChild(li);
  inputField.value = '';
}

function removeItem(button) {
  button.parentElement.remove();
}

// Shopping List Functions
const shoppingListEl = document.getElementById('shopping-items');

function addToShoppingList(item) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = item;
  shoppingListEl.appendChild(li);
}

function addToShoppingListFromInput() {
  const newItemInput = document.getElementById('new-item');
  if (newItemInput.value.trim() !== '') {
    addToShoppingList(newItemInput.value.trim());
    newItemInput.value = '';
  }
}

// Expiring Items & Low-Stock Alerts on Dashboard
function checkExpiringItems() {
  const expiringItems = document.getElementById('expiring-items');
  expiringItems.innerHTML = '<p>Expiring soon: Milk, Bread, Eggs</p>';
}
checkExpiringItems();

// Inventory Categorization & Drag-and-Drop
function enableDragDrop() {
  document.querySelectorAll('.inventory-category').forEach(section => {
    section.addEventListener('dragover', event => event.preventDefault());
    section.addEventListener('drop', event => {
      const itemId = event.dataTransfer.getData('text');
      const item = document.getElementById(itemId);
      if (item) {
        section.appendChild(item);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  enableDragDrop();
});

// Settings Functionality (if needed)
function saveSettings() {
  const dietaryPreferences = document.getElementById('dietary-preferences').value;
  const locationValue = document.getElementById('location').value;
  alert(`Settings saved!\nDietary Preferences: ${dietaryPreferences}\nLocation: ${locationValue}`);
}

// Optional: Generate recipes if the button is clicked without using the search input
function generateRecipes() {
  const query = recipeSearchInput.value;
  if (query.length > 0) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(response => response.json())
      .then(data => displayRecipes(data.meals))
      .catch(error => console.error('Error fetching recipes:', error));

  } else {
    alert('Please enter a recipe search term.');
  }

  recipeSearchInput.value="";
}
// document.querySelector("#recipe-results").style.display = 'block';
let GenerateBtn = document.querySelector(".btn btn-secondary")
GenerateBtn.addEventListener('click',()=>{
  recipeResults.innerHTML=""
  recipeResults.style.display = 'none';
  generateRecipes();

})
