let prefferednews = document.getElementById('HamburgerMenu')
let menu = document.getElementById('categoryMenu')
window.onload = () => menu.classList.remove('show') // Hide the menu on page load

prefferednews.addEventListener('click', () => { // Event listener for the hamburger menu
    menu.classList.toggle('show')
})

// Function to fetch news from the gnews API
function fetchNews(category = 'general') {

    //Setting up cache
    const CACHE_KEY = `newsData_${category}`;  // Key to store news articles  
    const CACHE_TIME_KEY = `newsTimestamp_${category}`;  // Key to store the time of the last API fetch  
    const CACHE_DURATION = 30 * 60 * 1000;  // 30 minutes in milliseconds  

    const cachedData = localStorage.getItem(CACHE_KEY); // Retrieve cached news articles (if available) from localStorage
    const cachedTime = Number(localStorage.getItem(CACHE_TIME_KEY)); // Retrieve the timestamp of the last API fetch from localStorage
    const now = new Date().getTime() // Get the current timestamp in milliseconds

    if (cachedTime && now - cachedTime >= CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);  // Clear expired cache
        localStorage.removeItem(CACHE_TIME_KEY);
        console.log("Cache expired, clearing storage...");
    }


     // Check if cached data is available and valid
    if (cachedData && cachedTime && now - cachedTime < CACHE_DURATION) {
        console.log(`Using cached news data for ${category}`);
        renderNews(JSON.parse(cachedData)); // Use cached data
        return;
    }


    let selectedCategory = category; // Get the selected category from the dropdown

    // Get selected language from dropdown if present
    let language = 'en';
    const langSelect = document.getElementById('language');
    if (langSelect) {
        language = langSelect.value;
    }

    // Fetch from backend instead of News API directly
    let finalUrl = `/api/gnews?category=${selectedCategory}&language=${language}`;

    fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => {
            // data is the full response object, articles is an object
            console.log(data)
            // If articles is an object, get its values
            const articles = data.articles ? Object.values(data.articles) : [];
            console.log(`Total articles found for ${selectedCategory}:`, articles.length);

            // ✅ Store fetched data in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME_KEY, now.toString()); // Cache timestamp
            console.log("News data cached successfully.");

            // ✅ Ensure the latest fetched news is displayed
            renderNews(data);  // This forces UI update

            let ihtml = ""
            for (let item of articles) {
                ihtml += `
<div class="card mx-2 my-2" style="width: 22rem;">
    <img src="${item.image || 'https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image'}" class="card-img-top" alt="News Image"
    onerror="this.onerror=null; this.src='https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image';">
    <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text">${item.description || "No description available."}</p>
        <a href="${item.url}" class="btn btn-primary my-4">Read More...</a>
    </div>
</div>
`
            }
            let cardContainer = document.getElementById('cardContainer');
            cardContainer.innerHTML = "";
            cardContainer.innerHTML = ihtml;
        })
        .catch((error) => {
            console.log('some error occured')
            console.error(error)
        })

}


// Function to fetch news for the second API (Currents API)
function fetchnews2(selectedCategory = 'general') {
    //Setting up cache
    const CACHE_KEY = `newsData_${selectedCategory}`;  // Key to store news articles  
    const CACHE_TIME_KEY = `newsTimestamp_${selectedCategory}`;  // Key to store the time of the last API fetch  
    const CACHE_DURATION = 30 * 60 * 1000;  // 30 minutes in milliseconds  

    const cachedData = localStorage.getItem(CACHE_KEY); // Retrieve cached news articles (if available) from localStorage
    const cachedTime = Number(localStorage.getItem(CACHE_TIME_KEY)); // Retrieve the timestamp of the last API fetch from localStorage
    const now = new Date().getTime() // Get the current timestamp in milliseconds

    if (cachedTime && now - cachedTime >= CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);  // Clear expired cache
        localStorage.removeItem(CACHE_TIME_KEY);
        console.log("Cache expired, clearing storage...");
    }


     // Check if cached data is available and valid
    if (cachedData && cachedTime && now - cachedTime < CACHE_DURATION) {
        console.log(`Using cached news data for ${selectedCategory}`);
        renderNews(JSON.parse(cachedData)); // Use cached data
        return;
    }


    // Get selected language from dropdown if present
    let language = 'en';
    const langSelect = document.getElementById('language');
    if (langSelect) {
        language = langSelect.value;
    }
    let finalurl2 = `/api/currentsapi?category=${selectedCategory}&language=${language}`;
     fetch(finalurl2)
        .then((response) => response.json())
        .then((data) => {
            // data is the full response object, articles is an object
            console.log(data)
            // If articles is an object, get its values
            const articles = data.news ? Object.values(data.news) : [];
            console.log(`Total articles found for ${selectedCategory}:`, articles.length);

            // ✅ Store fetched data in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME_KEY, now.toString()); // Cache timestamp
            console.log("News data cached successfully.");

            // ✅ Ensure the latest fetched news is displayed
            renderNews(data);  // This forces UI update

            let ihtml = ""
            for (let item of articles) {
                ihtml += `
<div class="card mx-2 my-2" style="width: 22rem;">
    <img src="${item.image || 'https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image'}" class="card-img-top" alt="News Image"
    onerror="this.onerror=null; this.src='https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image';">
    <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text">${item.description || "No description available."}</p>
        <a href="${item.url}" class="btn btn-primary my-4">Read More...</a>
    </div>
</div>
`
            }
            let cardContainer = document.getElementById('cardContainer');
            cardContainer.innerHTML = "";
            cardContainer.innerHTML = ihtml;
        })
        .catch((error) => {
            console.log('some error occured')
            console.error(error)
        })


    
}





// Fetch news on page load
fetchNews()
fetchnews2()



// ✅ Ensure this function exists before calling fetchNews
// renderNews function to display news articles on the page
function renderNews(data) {
    let ihtml = "";
    const articles = data.articles ? Object.values(data.articles) :
                    data.news ? Object.values(data.news) : [];

    for (let item of articles) {
        ihtml += `
            <div class="card mx-2 my-2" style="width: 22rem;">
                <img src="${item.image || 'https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image'}" class="card-img-top" alt="News Image"
                onerror="this.onerror=null; this.src='https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image';">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description || "No description available."}</p>
                    <a href="${item.url}" class="btn btn-primary my-4">Read More...</a>
                </div>
            </div>
        `;
    }

    document.getElementById("cardContainer").innerHTML += ihtml;
}
