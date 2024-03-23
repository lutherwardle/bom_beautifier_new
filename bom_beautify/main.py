import pandas as pd
from bokeh.plotting import figure
from bokeh.embed import json_item
import json

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('./sample_bom.csv')

# Initialize the Bokeh figure
plot = figure(title='CSV Data Plot', x_axis_label='X-axis', y_axis_label='Y-axis')

# Plot each row from the DataFrame
for index, row in df.iterrows():
    x_values = list(row.index)
    y_values = list(row.values)
    plot.line(x_values, y_values, legend_label=f'Row {index}')

# Convert the plot to a JSON object
plot_json = json.dumps(json_item(plot, "my_plot"))

# Print the JSON object (you can also save it to a file if needed)
print(plot_json)

# Save the JSON data to a file
with open('csv_data.json', 'w') as json_file:
    json_file.write(plot_json)

print('JSON file "plot_data.json" generated successfully.')

