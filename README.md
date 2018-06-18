# data-forge-plot

The Plotting API for use with [Data-Forge](https://github.com/data-forge/data-forge-ts).

Why not do your data wrangling, analysis and visualization entirely in JavaScript? To support my effort please buy or help promote my book 
[Data Wrangling with JavaScript](http://bit.ly/2t2cJu2).

Or check out my blog: [The Data Wrangler](http://www.the-data-wrangler.com/).

Do your prototyping and exploratory data analysis in JavaScript with [Data-Forge Notebook](http://www.data-forge-notebook.com/).

THIS JS LIBRARY IS A WORK IN PROGRESS

## Project Goals

- To go as simple and conveniently as possihble from a series or dataframe to chart.
- To be able to output charts and visualizations directly from Node.js to image files.
- To be able to export an web-based interactive chart from Node.js that could easily be hosted under a web-server.
- To integrate with a Juptyr Notebook style application for Node.js / JavaScript.
- To be able to serialize a chart to JSON and then reinstantiate it from the JSON in a web-app.
- To separate chart definition and data definition so that chart definitions can easily be reused with different data sets.
- To configure charts either via JSON or via the fluent API, ultimately though it should be able to be expressed in JSON but with fluent API as syntactic sugar.