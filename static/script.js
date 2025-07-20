let prefferednews = document.getElementById('HamburgerMenu');
let menu = document.getElementById('categoryMenu');

// Hide menu on page load
window.onload = () => menu.classList.remove('show');

// Toggle menu visibility
prefferednews.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// Event delegation for dynamic category menu
menu.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-category]");
    if (li) {
        const selected = li.dataset.category;
        history.pushState({}, '', `/${selected}`); // Update URL without reloading
        fetchnews1(selected); // Fetch news for selected category
        menu.classList.remove('show'); // Hide menu after selection
    }
});


// Fetch news from backend (GNews route)
function fetchnews1(category = 'general') {
    let selectedCategory = category;

    let language = 'en';
    const langSelect = document.getElementById('language');
    if (langSelect) {
        language = langSelect.value;
    }

    let finalUrl = `/api/gnews?category=${selectedCategory}&language=${language}`;

    fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            renderNews(data); // Only render here
        })
        .catch((error) => {
            console.log('Some error occurred');
            console.error(error);
        });
}

// Render news cards
function renderNews(data) {
    let ihtml = "";
    const articles = data.articles ? Object.values(data.articles) : [];

    console.log(`Total articles found:`, articles.length);

    for (let item of articles) {
        ihtml += `
            <div class="card mx-2 my-2" style="width: 22rem;">
                <img src="${item.image || 'https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image'}" class="card-img-top" alt="News Image"
                onerror="this.onerror=null; this.src='https://dummyimage.com/350x200/cccccc/ffffff&text=No+Image';">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description || "No description available."}</p>
                    <a href="${item.url}" class="btn btn-primary my-4" target="_blank">Read More...</a>
                </div>
            </div>
        `;
    }

    const container = document.getElementById("cardContainer");
    container.innerHTML = ""; // Clear before rendering
    container.innerHTML += ihtml;
}


window.addEventListener("load", () => {
    const category = window.newcategory || 'general';
    fetchnews1(category);
});
