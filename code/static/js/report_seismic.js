// function to insert content for the "detailed report" tab

// define the function
function insertHTML() {

    let newHTML = `
        
        <h1>Interactive Geomap Analysis of Seismic Activity and Salt Water Disposal Well Injection Rates in the Delaware Basin</h1>

        <h2 style="color:#996600">Abstract</h2>
        <p>This web-based project provides an interactive and comprehensive exploration of the relationship between induced seismic activity, saltwater disposal (SWD) well injection volumes, and subsurface pore pressure changes within the Delaware Basin, West Texas. Utilizing publicly accessible data from TexNet and employing advanced numerical models, the project aims to illuminate the complex interactions that contribute to induced seismicity. The website features interactive tabs that allow users to delve into various aspects of the study, including seismic activity in relation to SWD wells, produced water chemistry (project 1), and a detailed glossary of terms for educational purposes.</p>

        <p>The project employs a structured Extract, Transform, Load (ETL) methodology for data preparation, leveraging technologies such as Python's Pandas and Pyproj libraries for data manipulation and transformation, and Amazon RDS for database storage. The extracted data sets—comprising pressure data from text files, injection volume data from APIs, and seismic event data—are meticulously processed to ensure accuracy and usability.</p>

        <p>The core of the website is an interactive geomap analysis tool, hosted within an iframe, which visualizes the temporal and spatial dynamics of SWD practices, pore pressure alterations, and seismic events. This tool, alongside additional visualizations of produced water chemistry, aims to engage and inform stakeholders, researchers, and the general public about the environmental and operational implications of SWD wells.</p>

        <p>Through this digital platform, we endeavor to provide a narrative that connects SWD well operations with seismic activity and water chemistry, offering insights into sustainable practices and risk mitigation strategies in the context of oil and gas extraction. The project underscores the importance of integrating scientific research with interactive data visualization to foster a broader understanding of induced seismicity and its associated challenges.</p>

        <h2 style="color:#996600">Table of Contents</h2>

        <ul>
        <li><a href="#1-introduction">1. Introduction</a></li>
        <li><a href="#2-methodology">2. Methodology</a>
            <ul>
            <li><a href="#21-data-handling--database-creation">2.1 Data Handling & Database Creation</a>
                <ul>
                <li><a href="#211-extract">2.1.1 Extract</a></li>
                <li><a href="#212-transform">2.1.2 Transform</a></li>
                <li><a href="#213-load">2.1.3 Load</a></li>
                </ul>
            </li>
            <li><a href="#22-flask-app-creation--deployment">2.2 Flask App Creation & Deployment</a></li>
            <li><a href="#23-data-flow-big-picture">2.3 Data Flow Big Picture</a></li>
            <li><a href="#24-visualizations">2.4 Visualizations</a></li>
            </ul>
        </li>
        <li><a href="#3-conclusion">3. Conclusion</a></li>
        <li><a href="#4-glossary-of-terms">4. Glossary of Terms</a></li>
        <li><a href="#5-technologies">5. Technologies</a></li>
        <li><a href="#6-data-sources">6. Data Sources</a></li>
        <li><a href="#7-contributors">7. Contributors</a></li>
        </ul>

        <h2 style="color:#996600" id="1-introduction">1. Introduction</h2>
        <p>The significant increase in seismic activity within Texas, notably surpassing California in the occurrence of ML2.5 or higher earthquakes since 2022, marks a critical juncture for both scientific inquiry and environmental stewardship. This uptick in seismic events, particularly concentrated in areas such as the Delaware Basin and the Midland-Odessa area, necessitates a comprehensive examination of the links between seismicity and human interventions, notably those undertaken by the petroleum industry. Our study adopts a targeted approach, merging seismic data from the TexNet public catalog, SWD (Salt Water Disposal) well injection volume data, and pore pressure details from sophisticated gridded numerical models. This concerted effort aims to clarify the complex dynamics between SWD practices and the resulting seismic activity, with a particular focus on the Delaware Basin, a key area for unconventional shale oil and gas extraction that has seen a noticeable increase in seismicity since 2014.</p>

        <p>A key aspect of our study is the temporal scope, constrained to the period from January 1, 2017, to January 1, 2024. This timeframe is dictated by the availability of seismic data from TexNet, ensuring a comprehensive analysis based on the most reliable and complete datasets available. Both seismic and SWD well injection volume data, accessible through TexNet via API calls, are in the public domain, allowing for an open and transparent research process.</p>

        <p>Our research focuses on illustrating the correlation between seismic activity, SWD well injection volumes, and changes in pore pressure. Through the development of an interactive geomap analysis tool, we visualize how the volume of fluid injected into SWD wells potentially elevates pore pressure and, consequently, affects the seismic activity of faults in the region. This project is driven by the goal of providing a clear visual representation of these relationships, offering valuable insights into how injection practices may influence seismicity. By creating an innovative interactive geomap analysis tool, we aim to provide insights that can help stakeholders, policymakers, and the scientific community devise strategies to mitigate the seismic risks associated with these practices. It reflects our dedication to contributing to the understanding of induced seismicity's environmental and societal impacts, with the ultimate aim of guiding more informed and sustainable practices in petroleum extraction.</p>

        <h2 style="color:#996600" id="2-methodology">2. Methodology</h2> 

        <h3 style="color:#707070" id="21-data-handling--database-creation">2.1 Data Handling & Database Creation</h3>

        <p>The project's methodology for managing the diverse datasets required for our analysis entailed a structured approach to data handling and database creation, segmented into three primary stages: extract, transform, and load (ETL). This process ensured the data's integrity and usability for our analytical objectives.</p>

        <h4 id="211-extract">2.1.1 EXTRACT</h4>

        <ul>
        <li><strong>Pressure Data</strong>: Originated from a text file, this dataset was transformed into a CSV format to facilitate easier manipulation and integration into our analysis framework.</li>
        <li><strong>Injection Volume Data</strong>: Retrieved from an API endpoint (<a href="https://injection.texnet.beg.utexas.edu/api/Export">https://injection.texnet.beg.utexas.edu/api/Export</a>), with specific parameters tailored to extract only the data pertinent to our project's scope.</li>
        <li><strong>Earthquake Data</strong>: Sourced from another API endpoint (<a href="https://maps.texnet.beg.utexas.edu/arcgis/rest/services/catalog/catalog_all_flat/MapServer/0/query">https://maps.texnet.beg.utexas.edu/arcgis/rest/services/catalog/catalog_all_flat/MapServer/0/query</a>), utilizing targeted parameters to filter the dataset according to our analytical needs. The data was initially loaded in JSON format.</li>
        </ul>

        <h4 id="212-transform">2.1.2 TRANSFORM</h4>

        <ul>
        <li><strong>Pressure Data</strong>: Upon conversion to a Pandas DataFrame, the dataset was further refined by assigning a layer number to each row and converting the time column into a DateTime format for precise temporal analysis. Additionally, latitude and longitude values were transformed from the NAD 1927 State Plane Texas Central FIPS 4203 format to the WGS84 coordinate system using the pyproj library, ensuring geographical accuracy.</li>
        <li><strong>Injection Volume Data</strong> & <strong>Earthquake Data</strong>: Both datasets were processed into Pandas DataFrames for subsequent transformation steps. For the earthquake data, specifically, the event_date column was converted to DateTime format, and the time component was removed to retain only the date information (year-month-date), standardizing the temporal data across all datasets.</li>
        </ul>

        <h4 id="213-load">2.1.3 LOAD</h4>

        <p><strong>Amazon Web Services RDS</strong>: Selected for its capacity to efficiently manage and store large datasets, Amazon Web Services (AWS) RDS was utilized as the repository for our processed data. Through the employment of Python libraries such as Psycopg2 and SQLAlchemy, a connection was established between our database management tool (pgAdmin) and AWS RDS. Dedicated tables were created for each dataset (earthquakes, injectionVolumes, pressureData), with the DataFrame column names meticulously matched to the corresponding table headers within the database. This preparatory work facilitated the smooth transfer of each DataFrame into its respective table in AWS RDS, marking the completion of our data handling and database creation phase and laying the groundwork for our subsequent analysis.</p>

        <h3 style="color:#707070" id="22-flask-app-creation--deployment">2.2 Flask App Creation & Deployment</h3>
        <p>Our project's cornerstone is the development of a Flask application, acting as the crucial conduit between our comprehensive database hosted on Amazon Web Services (AWS) and the dynamic geomap featured on our web application. This Flask app is engineered to fetch, process, and present seismic activity, injection volume, and pore pressure data. It is designed to facilitate user access to real-time, interactive visualizations, enabling an in-depth exploration of the intricate relationships among these critical environmental and geological variables.</p>

        <h3 style="color:#707070" id="23-data-flow-big-picture">2.3 Data Flow Big Picture</h3>
        <p>The below flowchart outlines the overall data flow for a multi-tab application that integrates TexNet's seismic data and injection volumes with pressure data from a CMG model (output in .txt format). It features two APIs provided by TexNet, one for injection volumes and another for seismicity data. The data from these sources is consolidated into a PostgreSQL database on AWS Cloud. A Flask application, utilizing HTML, CSS, and JavaScript, serves this data on a multi-tab dashboard, providing a comprehensive and interactive view of the data.</p>

        <img src="{{ url_for('static', filename='images/report_seismic/project3_flowchart.png') }}" alt="flowchart">

        <h3 style="color:#707070" id="24-visualizations">2.4 Visualizations</h3>
        <p>The methodology for incorporating seismic, injection, and pressure data into our interactive geomap involves several integral steps, leveraging both the front-end capabilities provided through the web application and the back-end functionalities enabled by our Flask app:</p>
        <ol>
        <li><strong>Seamless Data Retrieval</strong>: Initially, the Flask app establishes secure connections to our AWS-hosted database, which is meticulously curated to include up-to-date and historically relevant data on seismic activities, injection volumes, and pore pressure measurements. This setup ensures that the database serves as a reliable and scalable source of information for our analysis.</li>
        <li><strong>Dynamic Data Processing</strong>: Upon user interaction, such as selecting specific tabs or initiating queries on the web application, the Flask app dynamically retrieves relevant datasets. It processes these datasets to fit the visualization requirements of the geomap, including converting data into GeoJSON format for geographic rendering and calculating necessary metrics that highlight the relationships between seismic events, injection practices, and subsurface pore pressure changes.</li>
        <li><strong>Interactive Geomap Visualization</strong>:
            <ul>
            <li>For <strong>seismic activity data</strong>, the app visualizes earthquake epicenters, magnitudes, and depths, allowing users to discern patterns and correlations with injection sites and pore pressure changes over time.</li>
            <li><strong>Injection volume data</strong> is represented through markers whose sizes reflect the volume of fluid injected, providing insights into the scale of SWD operations within the Delaware Basin. This visualization underscores temporal and spatial trends in injection practices.</li>
            <li><strong>Pore pressure data</strong> is integrated to illustrate how subsurface pressures vary across different geological layers and time periods, offering clues about the potential impact of fluid injections on the subsurface stress regime and seismicity.</li>
            </ul>
        </li>
        <li><strong>Enhanced User Engagement</strong>: The geomap is equipped with interactive features, such as pop-ups and sliders, enabling users to delve into specific details of each dataset. For instance, clicking on an injection marker might reveal the total volume injected and the corresponding time frame, while seismic markers could display information about the earthquake's magnitude, depth, and exact date.</li>
        <li><strong>Comprehensive Visualization Controls</strong>: A timeline slider control is incorporated into the geomap, facilitating the chronological exploration of seismic events, injection activities, and pore pressure changes. This feature allows users to visually track the progression and potential causality between SWD well injections and seismic activities, alongside corresponding pore pressure fluctuations.</li>
        </ol>
        <p>By harnessing the Flask app's capabilities to render these complex datasets interactively, our project not only demystifies the connections between induced seismicity, SWD practices, and subsurface dynamics but also promotes an engaging and educational experience for users. This comprehensive approach to data integration and visualization exemplifies our commitment to leveraging advanced technologies and methodologies to address critical environmental and geological questions, providing stakeholders, researchers, and the public with valuable insights into the sustainable management of natural resources and hazard mitigation.</p>

        <h2 style="color:#996600" id="3-conclusion">3. Conclusion</h2>
        <p>Through our project's analysis, incorporating injection data, seismic data, and pore pressure data, all visualized comprehensively, we have identified significant patterns that illuminate the relationship between SWD well operations and seismic activities in West Texas, particularly in the Delaware Basin. Our findings underscore the intricate connections between injection into SWD and the resultant seismic events, highlighting several key observations:</p>

        <ol>
        <li><strong>Spatial and Temporal Correlations</strong>: We observed a clear spatial correlation between the locations of SWD wells and the occurrence of seismic events, with earthquake epicenters tending to cluster around high-density injection areas. Temporally, increases in seismic activity were often preceded by periods of intensified injection volumes, suggesting a direct link between SWD practices and the timing of seismic events.</li>
        <li><strong>Pore Pressure Influence</strong>: The visualization of pore pressure data alongside seismic and injection activities has provided critical insights into how changes in subsurface pressure conditions can influence fault stability. The areas experiencing increased seismic activity correspond with regions showing elevated pore pressure levels, indicative of the role fluid injection plays in modifying the subsurface stress regime.</li>
        <li><strong>Injection Parameters</strong>: Our analysis has reinforced the understanding that the volume fluid injected into SWD wells are pivotal in assessing the risk of induced seismicity. The visualized data highlight areas where elevated injection activities align with increased seismic occurrences, offering a quantitative basis for evaluating the impact of SWD operations on seismic risk.</li>
        </ol>

        <p>This project has leveraged visual analytics to bridge the gap between complex data sets and actionable insights, providing a robust framework for understanding the dynamics of induced seismicity in the Delaware Basin. The correlations and patterns unveiled through our visualizations not only contribute to the scientific discourse on induced seismicity but also serve as a valuable resource for stakeholders in assessing and mitigating the seismic risks associated with SWD well operations.</p>

        <p>In conclusion, our visualized analysis presents a compelling narrative on the interactions between SWD well injections, pore pressure changes, and seismic activity, offering a nuanced perspective on the geological and operational factors that drive induced seismicity. As we advance, it is crucial to continue refining our methodologies and expanding our data sets to enhance the precision of our insights, ultimately guiding more sustainable and safer resource extraction practices.</p>

        <h2 style="color:#996600" id="4-glossary-of-terms">4. Glossary of Terms</h2>

        <ol>
        <li><ins>Class II Injection Well</ins>: A type of well designated for the injection of fluids associated with oil and natural gas production back into the ground. These wells are regulated under the Safe Drinking Water Act and are used to enhance oil production, dispose of brine (saltwater) that is a byproduct of oil and gas production, and store hydrocarbons that are liquid at standard temperature and pressure. Class II wells help in managing the byproducts of oil and gas extraction, thereby mitigating potential environmental impacts.</li>

        <li><ins>Salt Water Disposal (SWD) Well</ins>: A type of well used for the disposal of saline water (brine) that is produced along with oil and gas. The water is injected into porous rock formations deep underground, often into the same formation from which it was produced.</li>

        <li><ins>Seismic Activity</ins>: The frequency, type, and size of earthquakes experienced over a period of time in a specific area. Seismic activity is a natural process but can be influenced by human activities, such as the injection of fluids into the earth's subsurface.</li>

        <li><ins>Pore Pressure</ins>: The pressure of fluids within the pores of a rock or soil, which can affect the rock's mechanical properties and its ability to transmit fluids. Changes in pore pressure can influence the stability of the rock and potentially trigger seismic events.</li>

        <li><ins>Induced Seismicity</ins>: Earthquakes that result from human activities, such as the injection or extraction of fluids from the earth's subsurface, mining, reservoir-induced seismicity from the filling of large reservoirs, and other large-scale engineering projects.</li>

        <li><ins>TexNet</ins>: The Texas Seismological Network, a state-funded initiative to monitor and research earthquake activity across Texas. TexNet provides public access to seismic data through its catalog.</li>

        <li><ins>Injection Volume</ins>: The total amount of fluid injected into a well over a specified period. This term is particularly relevant in the context of SWD wells, where the volume of injected wastewater is a critical factor in understanding the potential for induced seismicity.</li>

        <li><ins>Gridded Numerical Models</ins>: Computational models that represent the subsurface through a grid of cells, allowing for the simulation of processes such as fluid flow and pressure changes. These models are used to predict how changes in conditions might affect the subsurface, including the potential for induced seismicity.</li>

        <li><ins>Interactive Geomap Analysis Tool</ins>: A digital tool that allows users to visualize and interact with geographic data on a map. In the context of this study, it refers to a tool developed to display seismic data, SWD well injection volumes, and pore pressure changes to analyze their relationships.</li>

        <li><ins>Delaware Basin</ins>: A sub-basin of the Permian Basin located in West Texas and southeastern New Mexico, known for its significant oil and gas production. The Delaware Basin has been a focus of study for induced seismicity related to petroleum extraction activities.</li>

        <li><ins>CMG (Computer Modelling Group) Model</ins>: A sophisticated computational tool used for simulating subsurface flow and transport phenomena, including hydrocarbon extraction, CO2 sequestration, and groundwater movement. CMG models are essential in the energy industry for reservoir simulation, helping in decision-making for exploration, development, and management of oil and gas resources.</li>

        <li><ins>Model Layers</ins>: Refers to the discrete stratigraphic units within a geological basin as represented in the CMG model. Each layer is a simplification of a geological formation or group of formations, characterized by specific properties such as porosity, permeability, and fluid saturation.</li>

        <li><ins>Model Layer 9-13 (Devonian-Silurian Top and Bottom Formation)</ins>: These layers correspond to the geological formations spanning the Devonian and Silurian periods within the model. They are critical for understanding the sedimentary deposits and hydrocarbon potential in the Delaware Basin.</li>

        <li><ins>Model Layer 19 (Ellenberger Formation)</ins>: This layer specifically represents the Ellenberger Formation within the CMG model, a significant carbonate rock formation dating back to the Early Ordovician period.</li>
        </ol>

        <h2 style="color:#996600" id="5-technologies">5. Technologies</h2>

        <ul>
        <li>Languages
            <ul>
                <li><a href="https://www.python.org/">Python 3.10 or higher</a></li>
                <li><a href="https://html.spec.whatwg.org/multipage/">HTML</a></li>
                <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference">Javascript</a></li>
                <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS">CSS</a></li>
                <li><a href="https://www.postgresql.org/docs/current/sql.html">SQL(via PostgreSQL)</a></li>
            </ul>
        </li>
        <li>Libraries / Modules / Plugins
            <ul>
                <li><a href="https://leafletjs.com/">Leaflet</a></li>
                <li><a href="https://getbootstrap.com/">Bootstrap 4.5.2</a></li>
                <li><a href="https://jquery.com/">jQuery 3.5.1</a></li>
                <li><a href="https://popper.js.org/">Popper.js 1.16.0</a></li>
                <li><a href="https://d3js.org/">D3.js v7</a></li>
                <li><a href="https://www.papaparse.com/">PapaParse 5.3.0</a></li>
                <li><a href="https://pandas.pydata.org/">Pandas</a></li>
                <li><a href="https://www.numpy.org">NumPy</a></li>
                <li><a href="https://www.psycopg.org/docs/">Psycopg2</a></li>
                <li><a href="https://www.sqlalchemy.org/">SQLAlchemy</a></li>
                <li><a href="https://pypi.org/project/pyproj/">Pyproj 3.6.1</a></li>
                <li><a href="https://flask.palletsprojects.com/en/3.0.x/">Flask</a></li>
            </ul>
        </li>
        <li>Other Tools
            <ul>
                <li><a href="https://www.postgresql.org/docs/">PostgreSQL</a></li>
                <li><a href="https://aws.amazon.com/rds/">Amazon Web Services RDS</a></li>
            </ul>
        </li>
        </ul>

        <h2 style="color:#996600" id="6-data-sources">6. Data Sources</h2>

        <ul>
        <li>CMG Model Output</li>
        <li><a href="https://www.beg.utexas.edu/texnet-cisr/texnet">TexNet Seismic Data</a></li>
        <li><a href="https://injection.texnet.beg.utexas.edu/api/Export">Injection Data API</a></li>
        <li><a href="https://www.usgs.gov/">USGS Produced Water Data</a></li>
        </ul>

        <h2 style="color:#996600" id="7-contributors">7. Contributors</h2>

        <ul>
        <li><a href="https://github.com/roxanadrv">Roxana Darvari</a></li>
        <li><a href="https://github.com/bsvab">Brittany Svab</a></li>
        <li><a href="https://github.com/ajuarez2112">Alejandro Juarez</a></li>
        <li><a href="https://github.com/thesarahcain">Sarah Cain</a></li>
        </ul>

    `;

    // Insert the new HTML content into the page
    document.getElementById("report_seismic").innerHTML = newHTML;
}

// call the function
insertHTML();