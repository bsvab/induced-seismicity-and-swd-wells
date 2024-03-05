// function to insert content for the "detailed report" tab

// define the function
function insertHTML() {

    let newHTML = `
        <h1>Analysis & Visualization of Produced Water Chemistry for Environmental & Agricultural Utilization</h1>

        <h2 style="color:#996600">Abstract:</h2>

        <p>Produced water, a byproduct of oil and gas extraction, poses environmental challenges due to its complex chemical composition and high salinity. This project focuses on two key objectives: analyzing the chemistry of produced water with a focus on scaling elements and evaluating the availability of lithium for potential extraction. Utilizing data from the United States Geological Survey (USGS), a comprehensive methodology for data cleaning and filtering is employed to ensure accuracy.</p>

        <p>The analysis encompasses key elements such as Sodium, Calcium, Chloride, Sulfate, and Magnesium, with a focus on Total Dissolved Solids (TDS) greater than 35,000 ppm. Applying natural chemical balance conditions refines the dataset, and stringent charge balance criteria are employed for reliability. Missing data are addressed with tailored strategies respecting chemical properties.</p>

        <p>Visualizations include box and violin plots showcasing elemental concentrations across geological basins, Piper plots for water type classification, and interactive maps revealing scaling element and lithium concentration clusters. The methodology ensures a clear representation of scaling element and lithium distribution and facilitates insights into spatial patterns. Furthermore, the project introduces a linear regression analysis on lithium concentration versus depth to investigate whether a relationship is present.</p>

        <p>In conclusion, this research provides a nuanced understanding of produced water chemistry, supports sustainable water management, aligns with DOE goals, and explores the potential for resource recovery. The methodologies presented are adaptable, promoting transparency and fostering environmentally responsible practices in the oil and gas industry.</p>

        <h2 style="color:#996600">Table of Contents:</h2>

        <ul>
            <li><a href="#1-introduction">Introduction</a>
                <ul>
                    <li><a href="#11-overview-of-produced-water">Overview of Produced Water</a></li>
                    <li><a href="#11-overview-of-produced-water">Objectives</a></li>
                </ul>
            </li>
            <li><a href="#2-data-acquisition--initial-processing">Data Acquisition & Initial Processing</a>
                <ul>
                    <li><a href="#21-raw-data-acquisition">Raw Data Acquisition</a></li>
                    <li><a href="#22-data-loading--merging">Data Loading & Merging</a></li>
                </ul>
            </li>
            <li><a href="#3-data-cleaning--filtering">Data Cleaning & Filtering</a>
                <ul>
                    <li><a href="#31-column-removal">Column Removal</a></li>
                    <li><a href="#32-data-filtering-based-on-tds">Data Filtering Based on TDS</a></li>
                    <li><a href="#33-applying-conditions-for-filtering">Applying Conditions for Filtering</a></li>
                    <li><a href="#34-handling-missing-data">Handling Missing Data</a></li>
                </ul>
            </li>
            <li><a href="#4-visualization">Visualization</a>
                <ul>
                    <li><a href="#41-methodology-for-generating-box--violin-plots">Methodology for Generating Box & Violin Plots</a></li>
                    <li><a href="#42-methodology-for-generating-piper-plots">Methodology for Generating Piper Plots</a></li>
                    <li><a href="#43-methodology-for-mapping-scaling-element-concentration-clusters">Methodology for Mapping Scaling Element Concentration Clusters</a></li>
                    <li><a href="#44-methodology-for-mapping-lithium-concentration-clusters">Methodology for Mapping Lithium Concentration Clusters</a></li>
                    <li><a href="#45-methodology-for-generating-a-linear-regression-on-li-concentration-vs-depth">Methodology for Generating a Linear Regression on Li Concentration vs Depth</a></li>
                </ul>
            </li>
            <li><a href="#5-conclusion">Conclusion</a></li>
            <li><a href="#6-glossary-of-terms">Glossary of Terms</a></li>
            <li><a href="#7-technologies">Technologies</a></li>
            <li><a href="#8-contributors">Contributors</a></li>
        </ul>

        <h2 style="color:#996600">1. Introduction:</h2>

        <h3 style="color:#707070">1.1. Overview of Produced Water</h3>

        <p>Produced water, the wastewater generated during the extraction of oil and gas and in other industrial processes, presents a significant environmental challenge. This water typically contains various chemicals and dissolved solids. The oil and gas industry often relies on injection wells to manage this produced water, where it is re-injected underground. While this method is efficient and cost-effective, it carries environmental risks, such as potential groundwater contamination and seismic activity inducement.</p>

        <p>In light of these challenges, the Department of Energy (DOE) has funded research to explore treatment options for high-salinity produced water from the oil and gas industry. This research also aims to investigate the feasibility of extracting critical elements, such as lithium, from produced water, thus turning a waste product into a potential resource.</p>

        <p>The oil and gas sector faces unique challenges in managing produced water, largely due to its complex chemical composition, high salinity, and the large volumes involved. Various treatment and management techniques are employed, balancing environmental impacts with economic considerations.</p>

        <h3 style="color:#707070">1.2. Objectives</h3>

        <p>This project, aligning with DOE's research interests, is centered around two key objectives:</p>

        <ol>
            <li>Analyzing the Chemistry of Produced Water: The aim is to understand the composition of produced water and identify elements that lead to scaling in treatment processes, a major impediment in water treatment leading to efficiency losses and increased costs.</li>
            <li>Evaluating Lithium Availability: We assess the potential for lithium extraction from produced water in the oil and gas industry across the U.S. With the current economic feasibility threshold for lithium extraction set at a concentration of 80 mg/l, this project explores the availability of lithium in produced water from different basins across the US, and anticipates future advancements in extraction technologies that could make it more economically viable.</li>
        </ol>

        <h2 style="color:#996600">2. Data Acquisition & Initial Processing:</h2>

        <h3 style="color:#707070">2.1. Raw Data Acquisition</h3>

        <p>The raw dataset for this study was sourced from the United States Geological Survey (USGS) website. The USGS provides comprehensive data on water resources, including data on produced water chemistry from various oil and gas basins across the United States. This dataset includes information on the concentrations of various elements, such as sodium, calcium, chloride, sulfate, and magnesium, as well as total dissolved solids (TDS) and lithium.</p>

        <p>The dataset is structured, containing rows representing individual samples and columns representing different parameters measured in the samples. Each sample is associated with a geographic location, allowing for spatial analysis of the data.</p>

        <h3 style="color:#707070">2.2. Data Loading & Merging</h3>

        <p>The raw data was loaded into a Python environment using the Pandas library, a powerful tool for data manipulation and analysis. The data was stored in a DataFrame object, allowing for easy manipulation and analysis.</p>

        <p>Multiple datasets were merged to create a comprehensive dataset covering multiple oil and gas basins across the United States. This merged dataset was then used for subsequent analysis.</p>

        <h2 style="color:#996600">3. Data Cleaning & Filtering:</h2>

        <h3 style="color:#707070">3.1. Column Removal</h3>

        <p>Before proceeding with the analysis, certain columns deemed irrelevant or redundant were removed from the dataset. This step streamlined the dataset, making it more manageable and improving computational efficiency.</p>

        <h3 style="color:#707070">3.2. Data Filtering Based on TDS</h3>

        <p>Produced water often has a high total dissolved solids (TDS) content, which can impact its usability and treatment requirements. To focus the analysis on samples with significant TDS levels, a filtering step was applied to exclude samples with TDS below a certain threshold.</p>

        <h3 style="color:#707070">3.3. Applying Conditions for Filtering</h3>

        <p>Further conditions were applied to the dataset to ensure the reliability and relevance of the data. These conditions included filtering out samples with incomplete information or suspected errors.</p>

        <h3 style="color:#707070">3.4. Handling Missing Data</h3>

        <p>Missing data points, a common issue in datasets, were addressed using appropriate strategies. Depending on the nature of the missing data and its potential impact on the analysis, various techniques such as imputation or removal of incomplete samples were employed.</p>

        <h2 style="color:#996600">4. Visualization:</h2>

        <p>The analysis of produced water chemistry and lithium availability was supported by various visualizations, aiding in data exploration and interpretation. The following methodologies were employed to generate visualizations:</p>

        <h3 style="color:#707070">4.1. Methodology for Generating Box & Violin Plots</h3>

        <p>Box and violin plots were used to visualize the distribution of elemental concentrations across different geological basins. These plots provide insights into the variability of element concentrations and highlight potential outliers.</p>

        <h3 style="color:#707070">4.2. Methodology for Generating Piper Plots</h3>

        <p>Piper plots were employed for water type classification based on major ion chemistry. These plots are particularly useful for visualizing the dominant ions present in the water samples and identifying distinct water types.</p>

        <h3 style="color:#707070">4.3. Methodology for Mapping Scaling Element Concentration Clusters</h3>

        <p>Interactive maps were created to visualize spatial clusters of scaling element concentrations in produced water samples. These maps allow for the identification of regions with elevated levels of scaling elements, aiding in risk assessment and management.</p>

        <h3 style="color:#707070">4.4. Methodology for Mapping Lithium Concentration Clusters</h3>

        <p>Similar to scaling element concentration maps, interactive maps were generated to visualize spatial clusters of lithium concentrations in produced water samples. These maps provide insights into the distribution of lithium across different oil and gas basins.</p>

        <h3 style="color:#707070">4.5. Methodology for Generating a Linear Regression on Li Concentration vs Depth</h3>

        <p>A linear regression analysis was performed to explore the relationship between lithium concentration and depth. This analysis aimed to determine if there is a correlation between lithium concentration and depth, which could inform future extraction strategies.</p>

        <h2 style="color:#996600">5. Conclusion:</h2>

        <p>The analysis and visualization of produced water chemistry presented in this project offer valuable insights into the composition and distribution of key elements in produced water samples from various oil and gas basins across the United States. By focusing on scaling elements and lithium availability, this research contributes to our understanding of produced water management and the potential for resource recovery.</p>

        <p>The methodologies employed in this project, including data cleaning, filtering, and visualization techniques, can be adapted and applied to other datasets, promoting transparency and fostering environmentally responsible practices in the oil and gas industry. By leveraging data-driven insights, stakeholders can make informed decisions regarding produced water treatment and management, ultimately contributing to sustainable water use and environmental protection.</p>

        <h2 style="color:#996600">6. Glossary of Terms:</h2>

        <ol>
            <li><ins>Produced Water</ins>: This refers to the water that is brought to the surface during oil and gas extraction. It often contains various organic and inorganic substances and is typically considered a byproduct of the hydrocarbon extraction process.</li>
            <li><ins>Well Depth</ins>: The vertical distance measured from the surface to the bottom of a well. This is a critical factor in geological and hydrological studies as it can influence the characteristics of the water or oil extracted.</li>
            <li><ins>Basin (Geological Basin)</ins>: A large-scale geological depression, often circular or elliptical in shape, where layers of sediment accumulate over time. Basins are critical in petroleum geology as they are often the sites of significant accumulations of oil and natural gas. These structures are formed by tectonic actions such as subsidence of the Earth's crust and can vary widely in size and complexity.</li>
            <li><ins>Formation (Geological Formation in Oil and Gas Reservoirs)</ins>: In the context of oil and gas exploration and production, a geological formation is a distinct layer of sedimentary rock with consistent characteristics that distinguish it from adjacent strata. These formations are critical in identifying potential reservoirs of hydrocarbons. They often contain organic material that, over geological time, has been transformed into oil and gas. The properties of a formation, such as porosity, permeability, and thickness, are key factors in determining the viability and productivity of an oil or gas reservoir. In oil and gas terminology, formations are usually named after the geographic location where they were first studied or identified. Understanding the geological formations is essential for successful drilling and extraction operations, as it guides the placement of wells and informs predictions about the presence and recoverability of oil and gas deposits.</li>
            <li><ins>Major Elements</ins>: These are the elements found in high concentrations in geological samples. They are significant in geochemical investigations as they influence the chemical and physical properties of rocks and fluids.</li>
            <li><ins>Scaling Elements in Produced Water Treatment</ins>: In the context of produced water treatment, scaling elements refer to minerals like calcium, magnesium, barium, and strontium, which can precipitate out of produced water under certain conditions. These precipitates can form scale that coats and clogs pipes and equipment, causing significant operational challenges in treatment processes. Managing scaling elements is crucial for efficient and cost-effective treatment of produced water.</li>
            <li><ins>Concentration</ins>: The abundance of a constituent divided by the total volume of a mixture. In geochemistry, concentration is a fundamental concept used to quantify the level of a particular element or compound in a geological sample. It is critical for understanding the composition and quality of groundwater, surface water, and produced water.</li>
            <li><ins>Molarity</ins>: A unit of concentration in chemistry, representing the number of moles of a solute dissolved in one liter of solution. It is a standard measure for quantifying the concentration of elements or compounds in a solution, crucial in geochemical analyses to determine the precise chemical makeup of water samples, including produced water.</li>
            <li><ins>Charge Balance</ins>: In geochemistry, this refers to the state where the sum of the charges from all the cations (positively charged ions) and anions (negatively charged ions) in a solution are balanced. It's important for understanding the chemical stability of mineral waters and produced waters.</li>
            <li><ins>Total Dissolved Solid (TDS)</ins>: A measure of the combined content of all inorganic and organic substances contained in a liquid. In water quality analysis and geochemistry, TDS is used to indicate the general quality of the water.</li>
            <li><ins>Violin Plot</ins>: A method of data visualization that combines a box plot with a kernel density plot. In environmental and geochemical studies, violin plots can illustrate the distribution and probability density of data, particularly useful for comparing multiple data sets.</li>
            <li><ins>Piper Plot</ins>: A graphical representation used in hydrochemistry to illustrate the chemical composition of water samples. The plot is divided into three fields: two triangular fields that show the major cations (calcium, magnesium, sodium, and potassium) and anions (carbonate, bicarbonate, sulfate, and chloride) respectively, and a central diamond-shaped field that provides a comprehensive view of water chemistry. Piper plots are instrumental in understanding the geochemical evolution of water, identifying water types, and assessing water-rock interaction processes.</li>
        </ol>

        <h2 style="color:#996600">7. Technologies:</h2>

        <ul>
        <li>Languages:</li>
            <ul>
                <li><a href="https://www.python.org/">Python 3.10 or higher</a></li>
                <li><a href="https://html.spec.whatwg.org/multipage/">HTML</a></li>
            </ul>
        <li>Libraries / Modules / Plugins:</li>
            <ul>
                <li><a href="https://pandas.pydata.org/">Pandas</a></li>
                <li><a href="https://www.numpy.org">NumPy</a></li>
                <li><a href="https://matplotlib.org/">Matplotlib</a></li>
                <li><a href="https://www.scipy.org/scipylib">SciPy</a></li>
                <li><a href="https://scikit-learn.org/stable/index.html">Scikit-learn</a></li>
                <li><a href="https://github.com/jyangfsu/WQChartPy/tree/main?tab=readme-ov-file">WQChartPy</a></li>
                <li><a href="https://seaborn.pydata.org/#">Seaborn</a></li>
                <li><a href="https://geopandas.org/en/stable/#">GeoPandas</a></li>
                <li><a href="https://pypi.org/project/folium/">Folium</a></li>
                <li><a href="https://pypi.org/project/branca/">Branca</a></li>
            </ul>
        </ul>

        <h2 style="color:#996600">8. Contributors:</h2>

        <ul>
            <li><a href="https://github.com/roxanadrv">Roxana Darvari</a></li>
            <li><a href="https://github.com/bsvab">Brittany Svab</a></li>
            <li><a href="https://github.com/ajuarez2112">Alejandro Juarez</a></li>
            <li><a href="https://github.com/thesarahcain">Sarah Cain</a></li>
        </ul>
    `;

    // Insert the new HTML content into the page
    document.getElementById("report_chemistry").innerHTML = newHTML;
}

// call the function
insertHTML();