from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

G_NEWS_API_KEY = "3eeb69dae14f54add08ec07a3487cffe" # gnews.io key
CURRENTS_API_KEY = "zw8UXykSLG2wPQReN2452yWtzfSYNRYdWSuf0Sr8mMVb9fr1" # currentsapi key


@app.route('/api/gnews')
def api_gnews():
    try:
        category = request.args.get('category', 'general')
        language = request.args.get('language', 'en')
        url = (
        f"https://gnews.io/api/v4/top-headlines?"
        f"category={category}&lang={language}&apikey={G_NEWS_API_KEY}"
        )
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/currentsapi')
def api_currentsapi():
    try:
        language = request.args.get('language', 'en')
        url = (
            f"https://api.currentsapi.services/v1/latest-news?"
            f"lang={language}&apikey={CURRENTS_API_KEY}"
        )
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)