import os
import glob
import time
import pandas as pd

# Caution
# Your machine will explode if you use the real database
# Use with caution

IDENTIFIER = "MAC000002"
FILENAME = "block_0.csv"

DIR = 'halfhourly_dataset'

#csv_files = glob.glob(os.path.join(directory, 'block_*.csv'))

#dataframes = {}

#for file in csv_files:
#	filename = os.path.basename(file)
#	df = pd.read_csv(file)
#	print("Parsed file:", filename)
#	dataframes[filename] = df

#print("Parsed files:", dataframes.keys())




df = pd.read_csv(os.path.join(DIR, FILENAME))

#print(df['LCLid'].unique())

#print(df[df['LCLid'] == IDENTIFIER])


# main function, print each line of the file every 2 seconds
def main():
	#print each line of  LCLid == identifier every 2 seconds
	for index, row in df[df['LCLid'] == IDENTIFIER].iterrows():
		#padding
		print("-" * 10)
		print(row)
		time.sleep(2)


if __name__ == "__main__":
	main()