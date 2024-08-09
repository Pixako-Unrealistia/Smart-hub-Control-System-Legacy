import os
import glob
import time
import pandas as pd


IDENTIFIER = "MAC000027"
FILE_PATH = "mock_data/individuals"
FILENAME = "MAC000027.csv"

#DIR = 'halfhourly_dataset'

# set current file path to one directroy above the directory of this file
DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(DIR, FILE_PATH)

print(DIR)

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