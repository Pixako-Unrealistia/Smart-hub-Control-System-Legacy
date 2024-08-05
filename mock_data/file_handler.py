import os
import glob
import pandas as pd

# Caution
# Your machine will explode if you use the real database
# Use with caution

directory = os.path.join('data', 'halfhourly_dataset')

csv_files = glob.glob(os.path.join(directory, 'block_*.csv'))

dataframes = {}

for file in csv_files:
    filename = os.path.basename(file)
    df = pd.read_csv(file)
    dataframes[filename] = df

print("Parsed files:", dataframes.keys())