from flask import Flask,request, jsonify, render_template
import requests
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta  # Remove UTC
from flask_mail import Mail, Message  # Import Mail and Message for email functionality


load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email provider's SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

mongo.db.newsdb.create_index("fetched_at", expireAfterSeconds = 86400) # cached data will expire after 24 hours

G_NEWS_API_KEY = os.getenv("API_KEY") # gnewsapi key

@app.route('/api/gnews', methods=['GET'])
def api_gnews():
    try:
        query = request.args.get('query')  # Get ?query=...
        category = request.args.get('category', 'general')  # Default to 'general'
        language = request.args.get('language', 'en')       # Default to 'en'

        key_parts = [query or "", category or "", language] #
        query_key = "_".join(key_parts).strip("_")

        cached = mongo.db.newsdb.find_one({"_id": query_key})

        
         
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
        if response.status_code == 200:
            print("Data fetched from GNews API.")
            data = response.json()
            mongo.db.newsdb.replace_one(
                {"_id": query_key},
                {"_id": query_key, "data": data, "fetched_at": datetime.utcnow()},
                upsert=True  # Upsert to create or update the document
            )
            print("New data fetched and cached.")
            return jsonify(data)
        else:
            print(f"Error fetching data: {response.status_code}")
            if cached:
                print("Returning cached data due to API error.")
                return jsonify(cached['data'])
            else:
                return jsonify({"error": "Failed to fetch data from GNews API and no cached data available"}), 502

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return render_template("index.html", category='general')

@app.route('/<category>')
def home_category(category):
    return render_template("category.html", category=category)

@app.route('/Contact', methods=['POST', 'GET'])
def feedback():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        feedback = request.form['feedback']

    #save feedback to MongoDB
        mongo.db.user_details.insert_one({'name': name,
            'email': email,
            'feedback': feedback})
        
        # Send confirmation to user
        try:
            msg_to_user = Message("Thank You for Your Feedback!",
                                recipients=[email])
            msg_to_user.body = f"Hi {name},\n\nWe received your message:\n\"{feedback}\"\n\nThank you for getting in touch!"
            mail.send(msg_to_user)
        except Exception as e:
            print(f"Error sending to user: {e}")

        # Send notification to admin
        try:
            msg_to_admin = Message("New Feedback Submitted",
                                recipients=[app.config['MAIL_USERNAME']])  # your email
            msg_to_admin.body = f"New feedback from {name} ({email}):\n\n{feedback}"
            mail.send(msg_to_admin)
        except Exception as e:
            print(f"Error sending to admin: {e}")

        return render_template("contact.html", message="Thanks! Your feedback was submitted successfully.")
    return render_template("contact.html")


@app.route('/privacy-policy')
def privacy_policy():
    return render_template("privacy-policy.html")

@app.route('/terms-of-service')
def terms_of_service():
    return render_template("terms-of-service.html")

if __name__ == '__main__':
    app.run(debug=True, port=5000)