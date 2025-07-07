from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

NEWS_API_KEY = "618e6acee2b24825b958ca9e05d1e509"

@app.route('/api/news')
def api_news():
    category = request.args.get('category', 'general')
    language = request.args.get('language', 'en')
    url = (
        f"https://newsapi.org/v2/top-headlines?"
        f"category={category}&domains=bbc.com,cnn.com,wsj.com"
        f"&language={language}&apiKey={NEWS_API_KEY}"
    )
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)