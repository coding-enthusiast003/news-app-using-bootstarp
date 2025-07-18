let prefferednews = document.getElementById('HamburgerMenu')
let menu = document.getElementById('categoryMenu')
window.onload = () => menu.classList.remove('show') // Hide the menu on page load

prefferednews.addEventListener('click', () => { // Event listener for the hamburger menu
    menu.classList.toggle('show')
})

// Function to fetch news from the gnews API
function fetchNews(category = 'general') {

     


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

             
            // ✅ Ensure the latest fetched news is displayed
            renderNews(data);  // This forces UI update

            let ihtml = "";
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

            
            // ✅ Ensure the latest fetched news is displayed
            renderNews(data);  // This forces UI update
        })
        .catch((error) => {
            console.log('some error occured')
            console.error(error)
        })


    
}





// Fetch news on page load
document.getElementById("cardContainer").innerHTML = ""; // Clear before appending

fetchNews();
setTimeout(() => fetchnews2(), 500); // Add a small delay to avoid race condition


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