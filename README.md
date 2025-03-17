# 📰 News Website  

A simple news website using API that delivers the latest news and updates in various categories. Built using [ HTML, CSS, JavaScript with Bootstrap].  

## 📌 Features  
- 📰 Displays trending and latest news  
- 📂 Categorized news sections (Politics, Sports, Technology, etc.)  
- 📱  Responsive design for mobile and desktop 
- ⚡ Implements local storage caching to optimize API requests

🔹 Caching System (Optimized News Fetching)
✔ How It Works:

•  Checks cache validity: If cached data exists and is less than 30 minutes old, it is used.
•  Fetches fresh data if needed: If the cache is expired or missing, the old cache is cleared, and fresh news is fetched from the API.
•  Stores news data locally: The fetched news is saved in localStorage to reduce unnecessary API calls. 


   📝 Code Implementation:-
    
    //Setting up cache
    const CACHE_KEY = "newsData";  // Key to store news articles  
    const CACHE_TIME_KEY = "newsTimestamp";  // Key to store the time of the last API fetch  
    const CACHE_DURATION = 30 * 60 * 1000;  // 30 minutes in milliseconds  

    const cachedData = localStorage.getItem(CACHE_KEY); // Retrieve cached news articles (if available) from localStorage
    const cachedTime = Number(localStorage.getItem(CACHE_TIME_KEY)); // Retrieve the timestamp of the last API fetch from localStorage
    const now = new Date().getTime() // Get the current timestamp in milliseconds

    if (cachedTime && now - cachedTime >= CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);  // Clear expired cache
        localStorage.removeItem(CACHE_TIME_KEY);
        console.log("Cache expired, clearing storage...");
    }

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
        if (cachedData && cachedTime && now - cachedTime < CACHE_DURATION) {
            console.log("Using cached news data.");
            renderNews(JSON.parse(cachedData)); // Use cached data
            return;
        }

        let finalUrl = `https://newsapi.org/v2/top-headlines?category=${category}&domains=bbc.com,cnn.com,wsj.com&language=en&apiKey=${key}`;

        fetch(finalUrl)
            .then(response => response.json())
            .then(value => {
                console.log("Total articles found:", value.totalResults);

                // ✅ Store fetched data in cache
                localStorage.setItem(CACHE_KEY, JSON.stringify(value.articles));  // Cache articles
                localStorage.setItem(CACHE_TIME_KEY, now.toString());  // Cache timestamp
                console.log("News data cached successfully.");

                renderNews(value.articles); // Display news
            })
            .catch(error => {
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