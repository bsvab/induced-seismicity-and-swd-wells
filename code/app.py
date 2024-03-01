# FLASK APP HERE

from flask import Flask, jsonify, render_template, url_for, send_from_directory
import psycopg2
import psycopg2.extras
import pandas as pd

from config import PGEND_POINT
from config import PGDATABASE_NAME
from config import PGUSER_NAME
from config import PGPASSWORD

app = Flask(__name__)

# Route to index
@app.route('/')
def index():
    return render_template('index.html')

# Route to map1
@app.route('/map1')
def map1():
    return render_template('map1.html')

# Route to map2
@app.route('/map2')
def map2():
    return render_template('map2.html')

# Connection to database
def get_db_connection():
    conn = psycopg2.connect(
        host=PGEND_POINT,
        dbname=PGDATABASE_NAME,
        user=PGUSER_NAME,
        password=PGPASSWORD,
        port='5432'
    )
    return conn

# Route to earthquake data
@app.route('/earthquake_data')
def earthquake_data():
    try:
        conn = get_db_connection()
        earthquakes_df = pd.read_sql_query('SELECT * FROM earthquakes', conn)
        conn.close()
        # Convert the DataFrame to a list of dictionaries for easier processing in the template
        earthquakes = earthquakes_df.to_dict(orient='records')
        print(earthquakes)
        return jsonify(earthquakes)
    except Exception as e:
        return jsonify({'error': str(e)})

# Route to injection data
@app.route('/injection_data')
def injection_data():
    try:
        conn = get_db_connection()
        injections_df = pd.read_sql_query('SELECT * FROM injection_volumes', conn)
        conn.close()
        # Convert the DataFrame to a list of dictionaries for easier processing in the template
        injections = injections_df.to_dict(orient='records')
        print(injections)
        return jsonify(injections)
    except Exception as e:
        return jsonify({'error': str(e)})

# Route to pressure data
@app.route('/pressure_data')
def pressure_data():
    try:
        conn = get_db_connection()
        pressure_df = pd.read_sql_query('SELECT * FROM pressure_data', conn)
        conn.close()
        # Convert the DataFrame to a list of dictionaries for easier processing in the template
        pressure = pressure_df.to_dict(orient='records')
        print(pressure)
        return jsonify(pressure)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)