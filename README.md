# Interactive Geomap Analysis of Seismic Activity and Salt Water Disposal Well Injection Rates in the Delaware Basin

## <p style="color:#CC6600">Abstract</p>
This web-based project, titled "Produced Water Data & Analysis," provides an interactive and comprehensive exploration of the relationship between induced seismic activity, saltwater disposal (SWD) well injection volumes, and subsurface pore pressure changes within the Delaware Basin, West Texas. Utilizing publicly accessible data from TexNet and employing advanced numerical models, the project aims to illuminate the complex interactions that contribute to induced seismicity. The website features interactive tabs that allow users to delve into various aspects of the study, including seismic activity in relation to SWD wells, produced water chemistry (project 1), and a detailed glossary of terms for educational purposes.

The project employs a structured Extract, Transform, Load (ETL) methodology for data preparation, leveraging technologies such as Python's Pandas and Pyproj libraries for data manipulation and transformation, and Amazon RDS for database storage. The extracted data sets—comprising pressure data from text files, injection volume data from APIs, and seismic event data—are meticulously processed to ensure accuracy and usability.

The core of the website is an interactive geomap analysis tool, hosted within an iframe, which visualizes the temporal and spatial dynamics of SWD practices, pore pressure alterations, and seismic events. This tool, alongside additional visualizations of produced water chemistry, aims to engage and inform stakeholders, researchers, and the general public about the environmental and operational implications of SWD wells.

Through this digital platform, we endeavor to provide a narrative that connects SWD well operations with seismic activity and water chemistry, offering insights into sustainable practices and risk mitigation strategies in the context of oil and gas extraction. The project underscores the importance of integrating scientific research with interactive data visualization to foster a broader understanding of induced seismicity and its associated challenges.
## <p style="color:#CC6600">Table of Contents</p>

1. [Abstract](#abstract)
    - Overview of the project, objectives, and the tools used.
2. [Introduction](#introduction)
    - Background information on seismic activity in Texas and the project's scope.
3. [Methodology](#methodology)
    - Overview of the approach taken to analyze the data.

    3.1. [Data Handling & Database Creation](#data-handling--database-creation)
        - Details on the ETL process for pressure data, injection volume data, and earthquake data.

    3.2. [Flask App Creation & Deployment](#flask-app-creation--deployment)
        - Explanation of how the Flask app interfaces with the AWS-hosted database and the geomap.

    3.3. [Visualizations](#visualizations)
        - Description of the interactive geomap analysis tool and other visualizations.
        
4. [Conclusion](#conclusion)
    - Summary of findings and insights gained from the analysis.
5. [Glossary of Terms](#glossary-of-terms)
    - Definitions of key terms used throughout the report.
6. [Technologies](#technologies)
    - List and description of the technologies and libraries used in the project.
7. [Sources](#sources)
    - References and data sources utilized for the project.
8. [Contributors](#contributors)
    - Information about the team members who contributed to the project.
...

## <p style="color:#CC6600">1. Introduction</p>
The significant increase in seismic activity within Texas, notably surpassing California in the occurrence of ML2.5 or higher earthquakes since 2022, marks a critical juncture for both scientific inquiry and environmental stewardship. This uptick in seismic events, particularly concentrated in areas such as the Delaware Basin and the Midland-Odessa area, necessitates a comprehensive examination of the links between seismicity and human interventions, notably those undertaken by the petroleum industry. Our study adopts a targeted approach, merging seismic data from the TexNet public catalog, SWD (Salt Water Disposal) well injection volume data, and pore pressure details from sophisticated gridded numerical models. This concerted effort aims to clarify the complex dynamics between SWD practices and the resulting seismic activity, with a particular focus on the Delaware Basin, a key area for unconventional shale oil and gas extraction that has seen a noticeable increase in seismicity since 2014.

A key aspect of our study is the temporal scope, constrained to the period from January 1, 2017, to January 1, 2024. This timeframe is dictated by the availability of seismic data from TexNet, ensuring a comprehensive analysis based on the most reliable and complete datasets available. Both seismic and SWD well injection volume data, accessible through TexNet via API calls, are in the public domain, allowing for an open and transparent research process. 

our research focuses on illustrating the correlation between seismic activity, SWD well injection volumes, and changes in pore pressure. Through the development of an interactive geomap analysis tool, we visualize how the volume of fluid injected into SWD wells potentially elevates pore pressure and, consequently, affects the seismic activity of faults in the region. This project is driven by the goal of providing a clear visual representation of these relationships, offering valuable insights into how injection practices may influence seismicity. By creating an innovative interactive geomap analysis tool, we aim to provide insights that can help stakeholders, policymakers, and the scientific community devise strategies to mitigate the seismic risks associated with these practices. It reflects our dedication to contributing to the understanding of induced seismicity's environmental and societal impacts, with the ultimate aim of guiding more informed and sustainable practices in petroleum extraction.


## <p style="color:#CC6600">2. Methodology</p> 

...

### <p style="color:gray">2.1 Data Handling & Database Creation</p>

The project's methodology for managing the diverse datasets required for our analysis entailed a structured approach to data handling and database creation, segmented into three primary stages: extract, transform, and load (ETL). This process ensured the data's integrity and usability for our analytical objectives.

#### 2.1.1 EXTRACT

- **Pressure Data**: Originated from a text file, this dataset was transformed into a CSV format to facilitate easier manipulation and integration into our analysis framework.
  
- **Injection Volume Data**: Retrieved from an API endpoint (https://injection.texnet.beg.utexas.edu/api/Export), with specific parameters tailored to extract only the data pertinent to our project's scope.
  
- **Earthquake Data**: Sourced from another API endpoint (https://maps.texnet.beg.utexas.edu/arcgis/rest/services/catalog/catalog_all_flat/MapServer/0/query), utilizing targeted parameters to filter the dataset according to our analytical needs. The data was initially loaded in JSON format.

#### 2.1.2 TRANSFORM

- **Pressure Data**: Upon conversion to a Pandas DataFrame, the dataset was further refined by assigning a layer number to each row and converting the time column into a DateTime format for precise temporal analysis. Additionally, latitude and longitude values were transformed from the NAD 1927 State Plane Texas Central FIPS 4203 format to the WGS84 coordinate system using the pyproj library, ensuring geographical accuracy.
  
- **Injection Volume Data** & **Earthquake Data**: Both datasets were processed into Pandas DataFrames for subsequent transformation steps. For the earthquake data, specifically, the event_date column was converted to DateTime format, and the time component was removed to retain only the date information (year-month-date), standardizing the temporal data across all datasets.

#### 2.1.3 LOAD

- **Amazon RDS**: Selected for its capacity to efficiently manage and store large datasets, Amazon RDS was utilized as the repository for our processed data. Through the employment of Python libraries such as Psycopg2 and SQLAlchemy, a connection was established between our database management tool (pgAdmin) and Amazon RDS. Dedicated tables were created for each dataset (earthquakes, injectionVolumes, pressureData), with the DataFrame column names meticulously matched to the corresponding table headers within the database. This preparatory work facilitated the smooth transfer of each DataFrame into its respective table in Amazon RDS, marking the completion of our data handling and database creation phase and laying the groundwork for our subsequent analysis.
...

### <p style="color:gray">2.2 Flask App Creation & Deployment</p>
Our project's cornerstone is the development of a Flask application, acting as the crucial conduit between our comprehensive database hosted on Amazon Web Services (AWS) and the dynamic geomap featured on our web application. This Flask app is meticulously engineered to fetch, process, and present seismic activity, injection volume, and pore pressure data. It is designed to facilitate user access to real-time, interactive visualizations, enabling an in-depth exploration of the intricate relationships among these critical environmental and geological variables.

### <p style="color:gray">2.3 Visualizations</p>
The methodology for integrating the injection layer into our geomap involves a series of carefully orchestrated steps that leverage both the front-end capabilities outlined in the index.html file and the back-end functionality facilitated by our Flask app:

1. **Database Connection**: Our Flask app establishes a direct connection to the project's database hosted on Amazon Web Services (AWS). This database contains comprehensive data on injection volumes, seismic activities, and pore pressure changes.

2. **Data Retrieval and Processing**: Upon user interaction with the geomap, specifically through the "Induced Seismic Activity & Injection Wells" tab, the Flask app queries the AWS database for injection data. This data includes crucial information such as the dates of injection activities and the volumes of fluid injected, which are essential for visualizing the injection layer.

3. **GeoJSON Data Preparation**: The retrieved data is processed and converted into GeoJSON format, a widely used format compatible with web-based mapping solutions. This conversion is handled dynamically by the Flask app, ensuring that the data is readily usable by the front-end mapping library (Leaflet.js) for visualization.

4. **Front-End Visualization**:
   - The prepared GeoJSON data is fetched by the front-end JavaScript code embedded within the index.html file, specifically within the scripts designated for the geomap visualization.
   - A timeline visualization is created using the Leaflet.js library, allowing users to observe the temporal progression of injection activities across the Delaware Basin. This interactive timeline is integral to the "Induced Seismic Activity & Injection Wells" tab, providing a dynamic and engaging way for users to explore how injection volumes correlate with seismic events over time.

5. **Interactive User Experience**:
   - The injection layer is enhanced with interactive elements, such as circle markers representing injection events, whose sizes are proportional to the volume of fluid injected. Users can interact with these markers to reveal detailed information about each injection event, including the volume injected.
   - This interactive layer, coupled with the timeline control, enables users to navigate through different time periods, offering a comprehensive and intuitive exploration of injection data in relation to seismic activity.

By integrating the injection layer within the broader context of our web application, as detailed in the index.html file, we provide a cohesive and informative user experience. This approach not only facilitates a deeper understanding of the data but also showcases the potential of web technologies in environmental and geological analysis. Through the seamless interplay between the Flask app, AWS-hosted database, and front-end visualization tools, our project stands as a testament to the power of interdisciplinary collaboration in addressing complex environmental challenges.


## <p style="color:#CC6600">3. Conclusion</p>
Through our project's analysis, incorporating injection data, seismic data, and pore pressure data, all visualized comprehensively, we have identified significant patterns that illuminate the relationship between SWD well operations and seismic activities in West Texas, particularly in the Delaware Basin. Our findings underscore the intricate connections between injection into SWD and the resultant seismic events, highlighting several key observations:

1. **Spatial and Temporal Correlations**: We observed a clear spatial correlation between the locations of SWD wells and the occurrence of seismic events, with earthquake epicenters tending to cluster around high-density injection areas. Temporally, increases in seismic activity were often preceded by periods of intensified injection volumes, suggesting a direct link between SWD practices and the timing of seismic events.

2. **Pore Pressure Influence**: The visualization of pore pressure data alongside seismic and injection activities has provided critical insights into how changes in subsurface pressure conditions can influence fault stability. The areas experiencing increased seismic activity correspond with regions showing elevated pore pressure levels, indicative of the role fluid injection plays in modifying the subsurface stress regime.

3. **Injection Parameters**: Our analysis has reinforced the understanding that the volume fluid injected into SWD wells are pivotal in assessing the risk of induced seismicity. The visualized data highlight areas where elevated injection activities align with increased seismic occurrences, offering a quantitative basis for evaluating the impact of SWD operations on seismic risk.

This project has leveraged visual analytics to bridge the gap between complex data sets and actionable insights, providing a robust framework for understanding the dynamics of induced seismicity in the Delaware Basin. The correlations and patterns unveiled through our visualizations not only contribute to the scientific discourse on induced seismicity but also serve as a valuable resource for stakeholders in assessing and mitigating the seismic risks associated with SWD well operations.

In conclusion, our visualized analysis presents a compelling narrative on the interactions between SWD well injections, pore pressure changes, and seismic activity, offering a nuanced perspective on the geological and operational factors that drive induced seismicity. As we advance, it is crucial to continue refining our methodologies and expanding our data sets to enhance the precision of our insights, ultimately guiding more sustainable and safer resource extraction practices.

## <p style="color:#CC6600">4. Glossary of Terms</p> 

1.	<ins>Class II Injection Well</ins>: A type of well designated for the injection of fluids associated with oil and natural gas production back into the ground. These wells are regulated under the Safe Drinking Water Act and are used to enhance oil production, dispose of brine (saltwater) that is a byproduct of oil and gas production, and store hydrocarbons that are liquid at standard temperature and pressure. Class II wells help in managing the byproducts of oil and gas extraction, thereby mitigating potential environmental impacts.

2.	<ins>Salt Water Disposal (SWD) Well</ins>: A type of well used for the disposal of saline water (brine) that is produced along with oil and gas. The water is injected into porous rock formations deep underground, often into the same formation from which it was produced.

3.	<ins>Seismic Activity</ins>: The frequency, type, and size of earthquakes experienced over a period of time in a specific area. Seismic activity is a natural process but can be influenced by human activities, such as the injection of fluids into the earth's subsurface.

4. <ins>Pore Pressure</ins>: The pressure of fluids within the pores of a rock or soil, which can affect the rock's mechanical properties and its ability to transmit fluids. Changes in pore pressure can influence the stability of the rock and potentially trigger seismic events.

5. <ins>Induced Seismicity</ins>: Earthquakes that result from human activities, such as the injection or extraction of fluids from the earth's subsurface, mining, reservoir-induced seismicity from the filling of large reservoirs, and other large-scale engineering projects.

6. <ins>TexNet</ins>: The Texas Seismological Network, a state-funded initiative to monitor and research earthquake activity across Texas. TexNet provides public access to seismic data through its catalog.

7. <ins>Injection Volume</ins>: The total amount of fluid injected into a well over a specified period. This term is particularly relevant in the context of SWD wells, where the volume of injected wastewater is a critical factor in understanding the potential for induced seismicity.

8. <ins>Gridded Numerical Models</ins>: Computational models that represent the subsurface through a grid of cells, allowing for the simulation of processes such as fluid flow and pressure changes. These models are used to predict how changes in conditions might affect the subsurface, including the potential for induced seismicity.

9. <ins>Interactive Geomap Analysis Tool</ins>: A digital tool that allows users to visualize and interact with geographic data on a map. In the context of this study, it refers to a tool developed to display seismic data, SWD well injection volumes, and pore pressure changes to analyze their relationships.

10. <ins>Delaware Basin</ins>: A sub-basin of the Permian Basin located in West Texas and southeastern New Mexico, known for its significant oil and gas production. The Delaware Basin has been a focus of study for induced seismicity related to petroleum extraction activities.

## <p style="color:#CC6600">5. Technologies</p> 

**NEED TO UPDATE THE BELOW LIST FOR PROJECT 3 ITEMS**
- [Python 3.10 or higher](https://www.python.org/)
- [Pandas](https://pandas.pydata.org/)
- [NumPy](https://www.numpy.org)
- [Matplotlib](https://matplotlib.org/)
- [SciPy](https://www.scipy.org/scipylib)
- [Scikit-learn](https://scikit-learn.org/stable/index.html)
- [WQChartPy](https://github.com/jyangfsu/WQChartPy/tree/main?tab=readme-ov-file) 
- [Seaborn](https://seaborn.pydata.org/#) 
- [GeoPandas](https://geopandas.org/en/stable/#) 
- [Folium](https://pypi.org/project/folium/)
- [Branca](https://pypi.org/project/branca/)
- [HTML](https://html.spec.whatwg.org/multipage/)
- [Leaflet](https://leafletjs.com/) 
- [Bootstrap 4.5.2](https://getbootstrap.com/)
- [jQuery 3.5.1](https://jquery.com/)
- [Popper.js 1.16.0](https://popper.js.org/)
- [D3.js v7](https://d3js.org/)
- [PapaParse 5.3.0](https://www.papaparse.com/)
- [Amazon RDS](https://aws.amazon.com/rds/)
- [Psycopg2](https://www.psycopg.org/docs/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

## <p style="color:#CC6600">6. Sources</p> 
- **TexNet Seismic Data**: Detailed seismic activity data provided by the TexNet Seismological Network. [Visit TexNet](https://www.beg.utexas.edu/texnet-cisr/texnet)
- **USGS Produced Water Data**: Information on the chemical composition of produced water from the United States Geological Survey. [USGS Produced Water Data](https://www.usgs.gov/)
- **Injection Data API**: Real-time and historical data on fluid injection volumes accessed through the provided API endpoint. [Injection Data Source](https://injection.texnet.beg.utexas.edu/api/Export)
- **Leaflet.js Documentation**: For implementing interactive maps in the web application. [Leaflet.js](https://leafletjs.com/)
- **PapaParse Documentation**: Used for parsing CSV data within the web application. [PapaParse](https://www.papaparse.com/)
- **D3.js Library**: For creating sophisticated visualizations based on the project data. [D3.js](https://d3js.org/)
- **Bootstrap Framework**: For designing responsive and mobile-first web pages. [Bootstrap](https://getbootstrap.com/)
- **Python Documentation**: Reference for Python programming language used in data analysis and backend development. [Python](https://www.python.org/doc/)
- **Pandas Documentation**: Utilized for data manipulation and analysis. [Pandas](https://pandas.pydata.org/pandas-docs/stable/index.html)
- **GeoPandas Documentation**: For working with geospatial data in Python. [GeoPandas](https://geopandas.org/en/stable/)
- **Amazon RDS Documentation**: For database services used to store and manage the project data. [Amazon RDS](https://aws.amazon.com/rds/)

## <p style="color:#CC6600">7. Contributors</p> 

- [Roxana Darvari](https://github.com/roxanadrv)
- [Brittany Svab](https://github.com/bsvab)
- [John Cahill](https://github.com/ithilien12358)
- [Alejandro Juarez](https://github.com/ajuarez2112)
- [Sarah Cain](https://github.com/thesarahcain)