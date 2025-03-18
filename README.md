# 📰 News Website  

A dynamic news website that fetches and displays the latest news across various categories. Built using HTML, CSS, JavaScript, and Bootstrap, it integrates the News API to provide real-time updates. 

## 📌 Features  
- 📰 Displays trending and latest news  
- 📂 Categorized news sections (Politics, Sports, Technology, etc.)  
- 📱 Fully responsive design for mobile and desktop
- ⚡ Local storage caching to optimize API requests and reduce redundant fetches

## 🔹 Caching System (Optimized News Fetching)
✔ **How It Works:**

- ✅ **Cache validation:**  
  Uses cached data if it’s available and less than 30 minutes old.  

- 🔄 **Automatic refresh:**  
  Clears outdated cache and fetches fresh news when needed.  

- 💾 **Efficient storage:**  
  Saves news data in `localStorage` to reduce redundant API requests.  

📝 Code Implementation for cache setting(local storage):-

    // ✅ Ensure this function exists before calling fetchNews
function renderNews(articles) {
    let ihtml = "";
    for (let item of articles) {
        ihtml += `
            <div class="card mx-2 my-2" style="width: 22rem;">
                <img src="${item.urlToImage}" class="card-img-top" alt="News Image"
                onerror="this.onerror=null; this.src='https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image';">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description || "No description available."}</p>
                    <a href="${item.url}" class="btn btn-primary my-4">Read More...</a>
                </div>
            </div>
        `;
    }
    document.getElementById("cardContainer").innerHTML = ihtml; 
}

// ✅ Function to fetch news
function fetchNews(category = 'general') {

    // Setting up cache
    const CACHE_KEY = `newsData_${category}`;  // Key to store news articles  
    const CACHE_TIME_KEY = `newsTimestamp_${category}`;  // Key to store the time of the last API fetch  
    const CACHE_DURATION = 30 * 60 * 1000;  // 30 minutes in milliseconds  

    const cachedData = localStorage.getItem(CACHE_KEY); // Retrieve cached news articles (if available) from localStorage
    const cachedTime = Number(localStorage.getItem(CACHE_TIME_KEY)); // Retrieve the timestamp of the last API fetch from localStorage
    const now = new Date().getTime(); // Get the current timestamp in milliseconds

    if (cachedTime && now - cachedTime >= CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);  // Clear expired cache
        localStorage.removeItem(CACHE_TIME_KEY);
        console.log("Cache expired, clearing storage...");
    }

    // Check if cached data is available and valid
    if (cachedData && cachedTime && now - cachedTime < CACHE_DURATION) {
        console.log("Using cached news data.");
        renderNews(JSON.parse(cachedData)); // Use cached data
        return;
    }

    let selectedCategory = category; // Get the selected category from the dropdown

    let finalUrl = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&domains=bbc.com,cnn.com,wsj.com&language=en&apiKey=${key}`;

    let data = fetch(finalUrl);
    data.then((value) => {
        return value.json(); // Convert the response to JSON
    }).then((value) => {
        console.log(value);
        console.log(`Total articles found for ${selectedCategory}:`, value.totalResults);

        // ✅ Store fetched data in cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(value.articles));  // Cache articles
        localStorage.setItem(CACHE_TIME_KEY, now.toString());  // Cache timestamp
        console.log("News data cached successfully.");

        renderNews(value.articles); // Display news
    }).catch(error => {
        console.error("Error fetching news:", error);
    });

}

    

     
 


- (Adding more features soon...)  

## 🚀 Project Status  
This project is currently **in development**. More features will be added soon!  

 
## 🛠️ Technologies Used
• HTML
• CSS
• JavaScript
• Bootstrap
• News API