# data-forge-plot

Plotting API for use with Data-Forge

WORK IN PROGRESS

## Project Goals

- To go as simple and convenietly as possihble from a series or dataframe to chart.
- To be able to output charts and visualizations directly from Node.js to image files.
- To be able to export an web-based interactive chart from Node.js that could easily be hosted under a web-server.
- To integrate with a Juptyr Notebook style application for Node.js / JavaScript.
- To be able to serialize a chart to JSON and then reinstantiate it from the JSON in a web-app.
- To separate chart definition and data definition so that chart definitions can easily be reused with different data sets.
- To configure charts either via JSON or via the fluent API, ultimately though it should be able to be expressed in JSON but with fluent API as syntactic sugar.