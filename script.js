let key = "618e6acee2b24825b958ca9e05d1e509"
let url = `https://newsapi.org/v2/top-headlines?domains=bbc.com,cnn.com,wsj.com&language=en&apiKey=${key}`

const CACHE_KEY = "newsData";  // Key to store news articles  
const CACHE_TIME_KEY = "newsTimestamp";  // Key to store the time of the last API fetch  
const CACHE_DURATION = 30 * 60 * 1000;  // 30 minutes in milliseconds  

const cachedData = localStorage.getItem(CACHE_KEY); //to retrieve the value(news articles) from the key "newsData"
const cachedTime = localStorage.getItem(CACHE_TIME_KEY); //to retrieve the value(time) of the last API fetched
const now= new Date().getTime() //current time in milli-seconds

if (cachedTime && now - cachedTime >= CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);  // Clear expired cache
    localStorage.removeItem(CACHE_TIME_KEY);
    console.log("Cache expired, clearing storage...");
}


let prefferednews = document.getElementById('HamburgerMenu')
let menu = document.getElementById('categoryMenu')
window.onload = () => menu.classList.remove('show')

prefferednews.addEventListener('click', () => {
    menu.classList.toggle('show')
})


function fetchNews(category = 'general') {

    let selectedCategory = category;

     
  
 let finalUrl = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&domains=bbc.com,cnn.com,wsj.com&language=en&apiKey=${key}`

    let data = fetch(finalUrl)
    data.then((value) => {
        return value.json()
    }).then((value) => {
        console.log(value)
        console.log("Total articles found:", value.totalResults);
 
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
        cardContainer.innerHTML = ihtml;
    })
        .catch((error) => {
            console.log('some error occured')
            console.error(error)
        })

}

fetchNews()



