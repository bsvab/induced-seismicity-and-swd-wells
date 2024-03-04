# FLASK APP

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
    basins = [
        'Anadarko Basin',
        'Appalachian Basin',
        'Fort Worth Basin',
        'Gulf Coast Basin',
        'Illinois Basin',
        'Michigan Basin',
        'Oklahoma Platform Basins',
        'Permian Basin',
        'Rocky Mountain Basins',
        'Williston Basin'
    ]
    basins_no_spaces = [
        "AnadarkoBasin",
        "AppalachianBasin",
        "FortWorthBasin",
        "GulfCoastBasin",
        "IllinoisBasin",
        "MichiganBasin",
        "OklahomaPlatformBasins",
        "PermianBasin",
        "RockyMountainBasins",
        "WillistonBasin"
    ]
    return render_template('index.html', basins=basins, basins_no_spaces=basins_no_spaces)

@app.route('/index_copy')
def index_copy():
    basins = [
        'Anadarko Basin',
        'Appalachian Basin',
        'Fort Worth Basin',
        'Gulf Coast Basin',
        'Illinois Basin',
        'Michigan Basin',
        'Oklahoma Platform Basins',
        'Permian Basin',
        'Rocky Mountain Basins',
        'Williston Basin'
    ]
    basins_no_spaces = [
        "AnadarkoBasin",
        "AppalachianBasin",
        "FortWorthBasin",
        "GulfCoastBasin",
        "IllinoisBasin",
        "MichiganBasin",
        "OklahomaPlatformBasins",
        "PermianBasin",
        "RockyMountainBasins",
        "WillistonBasin"
    ]
    return render_template('index_copy.html', basins=basins, basins_no_spaces=basins_no_spaces)

# Route to tester
@app.route('/tester')
def tester():
    return render_template('tester.html')

# Route to chemistry_visualizations
@app.route('/chemistry_visualizations')
def chemistry_visualizations():
    return render_template('chemistry_visualizations.html')

# Route to chemistry_visualizations
@app.route('/chemistry_report')
def chemistry_report():
    return render_template('chemistry_report.html')

# Route to map1
@app.route('/map1')
def map1():
    return render_template('map1.html')

# Route to map2
@app.route('/map2')
def map2():
    return render_template('map2.html')

# Route to map3
@app.route('/map3')
def map3():
    return render_template('map3.html')

# Route to map4
@app.route('/map4')
def map4():
    return render_template('map4.html')

@app.route('/team_image_urls')
def get_team_image_urls():
    team = ['roxana_darvari', 'brittany_svab', 'alejandro_juarez', 'sarah_cain', 'john_cahill']
    team_image_urls = {}
    for person in team:
        filename = f'images/team/{person}.png'
        team_image_urls[person] = url_for('static', filename=filename)
    return jsonify(team_image_urls)

@app.route('/chemistry_image_urls')
def get_chemistry_image_urls():
    basins = [
        'Anadarko Basin',
        'Appalachian Basin',
        'Fort Worth Basin',
        'Gulf Coast Basin',
        'Illinois Basin',
        'Michigan Basin',
        'Oklahoma Platform Basins',
        'Permian Basin',
        'Rocky Mountain Basins',
        'Williston Basin'
    ]
    elements = ["Ca", "Mg", "HCO3", "Si", "FeTot", "Ba", "Sr", "Li"]
    basins_no_spaces = [
        "AnadarkoBasin",
        "AppalachianBasin",
        "FortWorthBasin",
        "GulfCoastBasin",
        "IllinoisBasin",
        "MichiganBasin",
        "OklahomaPlatformBasins",
        "PermianBasin",
        "RockyMountainBasins",
        "WillistonBasin"
    ]

    chemistry_boxplot_image_urls = {}
    chemistry_violinplot_image_urls = {}
    for basin in basins:
        basin_index = basins.index(basin)
        basin_no_spaces = basins_no_spaces[basin_index]
        for element in elements:
            boxplot_filename = f"images/chemistry/BoxPlot_{basin_no_spaces}_{element}.png"
            violinplot_filename = f"images/chemistry/ViolinPlot_{basin_no_spaces}_{element}.png"
            chemistry_boxplot_image_urls[f"{basin}_{element}"] = url_for('static', filename=boxplot_filename)
            chemistry_violinplot_image_urls[f"{basin}_{element}"] = url_for('static', filename=violinplot_filename)

    chemistry_piperplot_image_urls = {}
    for basin in basins:
        basin_no_spaces = basins_no_spaces[basins.index(basin)]
        piper_triangle_filename = f"images/chemistry/Piper(Triangle)_{basin_no_spaces}.png"
        piper_contour_filename = f"images/chemistry/Piper(Contour)_{basin_no_spaces}.png"
        piper_color_filename = f"images/chemistry/Piper(Color)_{basin_no_spaces}.png"
        chemistry_piperplot_image_urls[basin] = {
            "piper_triangle": url_for('static', filename=piper_triangle_filename),
            "piper_contour": url_for('static', filename=piper_contour_filename),
            "piper_color": url_for('static', filename=piper_color_filename)
        }
    
    return jsonify({
        "chemistry_boxplot_image_urls": chemistry_boxplot_image_urls,
        "chemistry_violinplot_image_urls": chemistry_violinplot_image_urls,
        "chemistry_piperplot_image_urls": chemistry_piperplot_image_urls
    })

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

@app.route('/earthquake_data')
def earthquake_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = 'SELECT * FROM earthquakes'  
        cursor.execute(query)
        rows = cursor.fetchall()
        features = []
        for row in rows:
            # Construct a GeoJSON feature for each row
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row['longitude'], row['latitude']]
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

# @app.route('/pressure_data')
# def pressure_data():
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
#         query = 'SELECT * FROM pressure_data'  
#         cursor.execute(query)
#         rows = cursor.fetchall()
#         features = []
#         for row in rows:
#             # Construct a GeoJSON feature for each row
#             feature = {
#                 "type": "Feature",
#                 "geometry": {
#                     "type": "Point",
#                     "coordinates": [row["longitude"], row["latitude"]]
#                 },
#                 "properties": {
#                     "Layer": row["layer"],
#                     "Date": row["time"],
#                     "Pressure Delta": row["pressure"]   # REPLACE WITH NEW COLUMN NAME WHEN AVAILABLE
#                 }
#             }
#             features.append(feature)
#         geojson = {
#             "type": "FeatureCollection",
#             "features": features
#         }
#         cursor.close()
#         conn.close()
#         return jsonify(geojson)
#     except Exception as e:
#         return jsonify({'error': str(e)})
    
@app.route('/pressure_data_9')
def pressure_data_9():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = 'SELECT * FROM pressure_data_9'  
        cursor.execute(query)
        rows = cursor.fetchall()
        features = []
        for row in rows:
            # Construct a GeoJSON feature for each row
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row["longitude"], row["latitude"]]
                },
                "properties": {
                    "layer": row["layer"],
                    "date": row["time"],
                    "pressure": row["pressure"],
                    "pressure_delta": row["delta"]
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
    
@app.route('/pressure_data_13')
def pressure_data_13():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = 'SELECT * FROM pressure_data_13'  
        cursor.execute(query)
        rows = cursor.fetchall()
        features = []
        for row in rows:
            # Construct a GeoJSON feature for each row
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row["longitude"], row["latitude"]]
                },
                "properties": {
                    "layer": row["layer"],
                    "date": row["time"],
                    "pressure": row["pressure"],
                    "pressure_delta": row["delta"]
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

@app.route('/pressure_data_19')
def pressure_data_19():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = 'SELECT * FROM pressure_data_19'  
        cursor.execute(query)
        rows = cursor.fetchall()
        features = []
        for row in rows:
            # Construct a GeoJSON feature for each row
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row["longitude"], row["latitude"]]
                },
                "properties": {
                    "layer": row["layer"],
                    "date": row["time"],
                    "pressure": row["pressure"],
                    "pressure_delta": row["delta"]
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

if __name__ == '__main__':
    app.run(debug=True)