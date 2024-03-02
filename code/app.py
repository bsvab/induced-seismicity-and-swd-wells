# FLASK APP HERE
from flask import Flask, jsonify, render_template, url_for, send_from_directory
import psycopg2
import psycopg2.extras
import pandas as pd
import os

from config import PGEND_POINT
from config import PGDATABASE_NAME
from config import PGUSER_NAME
from config import PGPASSWORD

app = Flask(__name__)

# Route to index
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map1')
def map1():
    return render_template('map1.html')

@app.route('/map2')
def map2():
    return render_template('map2.html')

@app.route('/team_image_urls')
def get_team_image_urls():
    team = ["roxana_darvari", "brittany_svab", "alejandro_juarez", "sarah_cain", "john_cahill"]
    team_image_urls = {}
    for person in team:
        filename = f"images/team/{person}.png"
        team_image_urls[person] = url_for('static', filename=filename)
    print(team_image_urls)  # Log the generated image URLs
    return jsonify(team_image_urls)


def get_db_connection():
    conn = psycopg2.connect(
        host=PGEND_POINT,
        dbname=PGDATABASE_NAME,
        user=PGUSER_NAME,
        password=PGPASSWORD,
        port='5432'
    )
    return conn

@app.route('/earthquake_data')
def earthquake_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = 'SELECT *, lat, lon FROM earthquakes'  
        cursor.execute(query)
        rows = cursor.fetchall()
        features = []
        for row in rows:
            # Construct a GeoJSON feature for each row
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row['lon'], row['lat']]
                },
                "properties": dict(row)
            }
            features.append(feature)
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        cursor.close()
        conn.close()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/injection_data')
def injection_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # Update your query here with column aliases
        cursor.execute('''
            SELECT api_number, volume_injected_bbls, injection_date, injection_end_date, surface_longitude AS lon, surface_latitude AS lat
            FROM injection_volumes
        ''') 
        rows = cursor.fetchall()
        features = []
        for row in rows:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row['lon'], row['lat']]
                },
                # Assuming you want to include all other properties as well
                "properties": {
                    "API Number": row['api_number'],
                    "Volume Injected (BBLs)": row['volume_injected_bbls'],
                    "Injection Date": row['injection_date'],
                    "Injection End Date": row['injection_end_date'],
                }
            }
            features.append(feature)
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        cursor.close()
        conn.close()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/pressure_data')
def pressure_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = 'SELECT *, lat, lon FROM pressure_data'  
        cursor.execute(query)
        rows = cursor.fetchall()
        features = []
        for row in rows:
            # Construct a GeoJSON feature for each row
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row['lon'], row['lat']]
                },
                "properties": dict(row)
            }
            features.append(feature)
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        cursor.close()
        conn.close()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)