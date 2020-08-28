from dotenv import load_dotenv
from os import getenv
from flask import Flask, render_template, redirect, Blueprint
from flask_pymongo import PyMongo
from flask import Flask, jsonify
import json
from datetime import datetime
load_dotenv()

app = Flask(__name__)

# Get connection string for the database
#app.config["MONGO_URI"] = "mongodb://localhost:27017/meteorite_db"
app.config["MONGO_URI"] = getenv('MONGO_URI', '')

#use PyMongo to establish Mongo Connection
mongo = PyMongo(app)


@app.after_request  # blueprint can also be app~~
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    return response


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/scatter")
def scatter():
    return render_template("scatter.html")

@app.route("/map2")
def map2():
    return render_template("map2.html")


@app.route("/api/landing_data")
def landing_data():
    start_date = datetime(2008, 1, 5)
    end_date = datetime(2018, 1, 5)
    landings = mongo.db.landings.find(
        {'year': {'$lt': end_date, '$gt': start_date}}, {'_id': False})

    bla = [landing for landing in landings]
    ble = {
        "data": bla
    }
    return jsonify(ble)


@app.route("/api/landingModified")
def landingsModified():
    start_date = 2003
    end_date = 2020
    landings = mongo.db.landingsModified.find(
        {'year': {'$lt': end_date, '$gt': start_date}}, {'_id': False})

    bla = [landing for landing in landings]

    ble = {
        "data": bla
    }
    return jsonify(ble)


if __name__ == "__main__":
    app.run(debug=True)
