from flask import Flask, request, jsonify, render_template
import requests
from flask_pymongo import PyMongo
from datetime import datetime, timedelta  # Remove UTC

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/db1"
mongo = PyMongo(app)

G_NEWS_API_KEY = "3eeb69dae14f54add08ec07a3487cffe" # gnewsapi key

def delete_old_cache(): # Function to delete old cache entries
    """Delete news items older than 1 day."""
    # datetime.utcnow() is used to get the current time in UTC(Universal Time Coordinated)
    # timedelta(days=1) creates a time delta of 1 day
    expiry_time = datetime.utcnow() - timedelta(days=1) # (current time)-1 day = expiry time
    result = mongo.db.newsdb.delete_many({"fetched_at": {"$lt": expiry_time}})
    print(f"Deleted {result.deleted_count} expired news items.")


@app.route('/api/gnews', methods=['GET'])
def api_gnews():
    try:
        query = request.args.get('query') # Get query parameter
        category = request.args.get('category', 'general') # Get category parameter
        language = request.args.get('language', 'en') # Get language parameter

        key_parts = [query or "", category or "", language] #
        query_key = "_".join(key_parts).strip("_")

        cached = mongo.db.newsdb.find_one({"_id": query_key})
        # Call to delete old cache entries
        delete_old_cache()

        # Check if cached data exists and is not older than 30 minutes
        # datetime.utcnow() - cached['fetched_at'] checks if the cached data is older
        if cached and datetime.utcnow() - cached['fetched_at'] < timedelta(minutes=30):
            print("Serving from cache.")
            return jsonify(cached['data'])
        

        if query:
            url = (
                f"https://gnews.io/api/v4/search?"
                f"q={query}&category={category}&lang={language}&apikey={G_NEWS_API_KEY}"
            )
        else:
            url = (
                f"https://gnews.io/api/v4/top-headlines?"
                f"category={category}&lang={language}&apikey={G_NEWS_API_KEY}"
            )
        response = requests.get(url)
        data = response.json()
        mongo.db.newsdb.replace_one(
            {"_id": query_key},
            {"_id": query_key, "data": data, "fetched_at": datetime.utcnow()},
              upsert=True  # Upsert to create or update the document
        )
        print("New data fetched and cached.")
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return render_template("index.html", category='general')

@app.route('/<category>')
def home_category(category):
    return render_template("category.html", category=category)

if __name__ == '__main__':
    app.run(debug=True, port=5000)