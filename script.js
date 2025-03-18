let key = "618e6acee2b24825b958ca9e05d1e509"
let url = `https://newsapi.org/v2/top-headlines?domains=bbc.com,cnn.com,wsj.com&language=en&apiKey=${key}`




let prefferednews = document.getElementById('HamburgerMenu')
let menu = document.getElementById('categoryMenu')
window.onload = () => menu.classList.remove('show') // Hide the menu on page load

prefferednews.addEventListener('click', () => { // Event listener for the hamburger menu
    menu.classList.toggle('show')
})


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



    let finalUrl = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&domains=bbc.com,cnn.com,wsj.com&language=en&apiKey=${key}`

    let data = fetch(finalUrl)
    data.then((value) => {
        return value.json() // Convert the response to JSON
    }).then((value) => {
        console.log(value)
        console.log(`Total articles found for ${selectedCategory}:`, value.totalResults);

        // ✅ Store fetched data in cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(value.articles)); // Cache articles
        localStorage.setItem(CACHE_TIME_KEY, now.toString()); // Cache timestamp
        console.log("News data cached successfully.");

        // ✅ Ensure the latest fetched news is displayed
        renderNews(value.articles);  // This forces UI update

        let ihtml = ""
        for (let item of value.articles) {
            console.log(item.title)
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
`
        }
        let cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ""; // ✅ Clear old content before adding new content
        cardContainer.innerHTML = ihtml;
    })
        .catch((error) => {
            console.log('some error occured')
            console.error(error)
        })

}

// Fetch news on page load
fetchNews()



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