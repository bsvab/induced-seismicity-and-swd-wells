# Interactive Geomap Analysis of Seismic Activity and Salt Water Disposal Well Injection Rates in the Delaware Basin

## Team members:
- Roxana Darvari
- Brittany Svab
- John Cahill
- Alejandro Juarez
- Sarah Cain

## Executive Summary
This proposal outlines a detailed plan to investigate the relationship between induced seismic activity and salt water disposal (SWD) well injection rates in the Delaware Basin. Utilizing data from the public catalog TexNet and incorporating pore pressure data from a sophisticated gridded numerical model developed using Computer Modelling Group (CMG) software, our goal is to uncover potential correlations and deepen our understanding of the seismic risks associated with SWD well injection practices.

## Objectives
- To analyze and visualize seismic activity patterns alongside SWD well injection rates.
- To integrate TexNet earthquake data (public domain catalog), SWD well injection rate data (public domain data), and pore pressure data (output of the model) from a CMG-built gridded model for comprehensive analysis.

## Database Development
We will develop a database system pivotal for analyzing the relationship between seismic activity, SWD well injection rates, and pore pressure in the Delaware Basin. This integrated database will enable us to derive insights for safer and more sustainable SWD well injection practices.

### 1. Scope
- **Earthquake Data**: Sourced from the TexNet public catalog via API ([TexNet Catalog](https://maps.texnet.beg.utexas.edu/arcgis/rest/services/catalog/catalog_all_flat/MapServer)).
- **SWD Well Injection Rate Data**: Via relevant APIs ([Injection Data](https://injection.texnet.beg.utexas.edu/apidocs)).
- **Pore Pressure Data**: Extracted from CMG model outputs, provided as TXT files.

### 2. Database Design
- **Tables**: The database will include three primary tables: `earthquakes`, `well_injection_rates`, and `pore_pressure`, each designed to store specific datasets with appropriate primary keys and data types.
- **Relationships**: Identifying relationships between tables to facilitate comprehensive data analysis.
- **Data Types**: Careful consideration of data types for each column to ensure data integrity and query efficiency.

### 3. Implementation Steps
- **Database and Table Creation**: Utilizing PostgreSQL, the database and tables will be created according to the defined schema, ensuring robustness for storing and querying large datasets.
- **Data Extraction and Transformation**: Utilize Python scripts for API calls to fetch earthquake and SWD well injection rate data. Process the CMG model's TXT file output to extract pore pressure data, preparing it for database insertion.
- **Data Loading**: Employ `psycopg2` or a similar library for data insertion into PostgreSQL. Automate the data insertion process for ongoing data collection and updates.
- **Verification and Iteration**: Conduct data integrity checks and performance optimization. Refine the database schema as needed based on initial findings and data analysis requirements.

### 4. Technologies
- **Database**: PostgreSQL for its advanced features and support for complex queries.
- **Programming Languages**: Python/JavaScript for data extraction, transformation, and loading processes.
- **Libraries**: `requests` for API interactions, `pandas` for data processing, and `psycopg2` for database interactions.

## Integrated Data Visualization Development
We propose to create a cutting-edge visualization tool designed to investigate the causal mechanisms of seismicity attributable to produced water injection into Underground Injection Control (UIC) wells and the associated changes in pore pressure. This tool will integrate sophisticated mapping and data analysis features, providing users with a comprehensive platform for exploring and understanding the seismic impact of SWD practices.

### 1. Layered Geomaps and Time-Series Plots
The visualization toolkit will consist of the following interconnected components:
- **Layered Geomaps**: An interactive geomap will serve as the base layer, upon which data from the TexNet earthquake catalog, SWD well injection rates, and CMG gridded model data on pore pressure will be overlaid. These layers will be animated to display changes over time, providing an intuitive visual understanding of the evolving relationships.

![Layered Geomap Example](/images/proposal_images/animation.png "Layered Geomap Example")

- **Time-Series Plots**: The tool will generate time-series plots that allow users to examine trends and correlations. These plots will feature:
  - Mean pore pressure increase over time (CMG gridded model data)
  - Wastewater injection rates (public domain data)
  - Earthquake frequency (TexNet data)
![Layered Geomap Example](/images/proposal_images/time_series.png "Layered Geomap Example")
### 2. User-Driven Data Exploration
- **Interactive Selection Tools**: Users will be able to specify parameters such as geographic location (x,y), radius for data extraction, and time range for analysis. This customization will allow for focused investigation of specific areas within the Delaware Basin.
- **Synchronized Animation and Plotting**: As users run the animation on the geomap, synchronized time-series plots will update in real time to reflect the data corresponding to the chosen location

### 3. Technologies and Tools
- **Data Sources**:Integration of TexNet earthquake data, SWD well injection rate data, and CMG gridded model data.
- **Programming Languages**: Utilization of Python for backend data analysis and visualization scripting, coupled with JavaScript for frontend interactive visualization features.
- **Web Development Technologies**: : Employment of HTML and CSS to structure and style the web interface, ensuring accessibility and ease of use.

## Conclusion
This project is committed to providing a thorough understanding of the interplay between seismic activity and SWD well injection practices in the Delaware Basin. By integrating diverse data sources and developing an interactive visualization tool, we aim to deliver actionable insights and recommendations, contributing to safer and more sustainable injection practices in the region.