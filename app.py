from flask import Flask, request, jsonify, render_template
import requests
from flask_pymongo import PyMongo
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/db1"
mongo = PyMongo(app)

G_NEWS_API_KEY = "3eeb69dae14f54add08ec07a3487cffe" # gnews.io key
CURRENTS_API_KEY = "zw8UXykSLG2wPQReN2452yWtzfSYNRYdWSuf0Sr8mMVb9fr1" # currentsapi key


@app.route('/api/gnews')
def api_gnews():
    try:
        query = request.args.get('query')
        category = request.args.get('category', 'general')
        language = request.args.get('language', 'en')

        key_parts = [query or "", category or "", language]
        query_key = "_".join(key_parts).strip("_")

        cached = mongo.db.newsdb.find_one({"_id": query_key})
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

@app.route('/api/currentsapi')
def api_currentsapi():
    try:
        query = request.args.get('query')
        category = request.args.get('category', 'general')
        language = request.args.get('language', 'en')

        key_parts = [query or "", category or "", language]
        query_key = "_".join(key_parts).strip("_")

        cached = mongo.db.newsdb.find_one({"_id": query_key})
        if cached and datetime.utcnow() - cached['fetched_at'] < timedelta(minutes=30):
            print("Serving from cache.")
            return jsonify(cached['data'])

        if query:
            url = (
                f"https://api.currentsapi.services/v1/search?"
                f"query={query}&lang={language}&apikey={CURRENTS_API_KEY}"
            )
        else:
            url = (
                f"https://api.currentsapi.services/v1/latest-news?"
                f"lang={language}&apikey={CURRENTS_API_KEY}"
            )
        response = requests.get(url)
        data = response.json()
        mongo.db.newsdb.replace_one(
            {"_id": query_key},
            {"_id": query_key, "data": data, "fetched_at": datetime.utcnow()},
            upsert=True
        )
        print("New data fetched and cached.")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)