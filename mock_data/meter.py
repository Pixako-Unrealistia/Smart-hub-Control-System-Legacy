import os
import glob
import pandas as pd


PATH = "./halfhourly_dataset"

csv_files = glob.glob(os.path.join(PATH, "block_*.csv"))
print(csv_files)

output_dir = "./individuals"
os.makedirs(output_dir, exist_ok=True)

for file in csv_files:
	df = pd.read_csv(file)
	
	grouped = df.groupby('LCLid')
	
	for LCLid, group in grouped:
		output_file = os.path.join(output_dir, f"{LCLid}.csv")
		group.to_csv(output_file, index=False)
	print(f"Processed {file} into {len(grouped)} files")


# Want to go faster? use code below and comment above

#import os
#import glob
#import pandas as pd
#from concurrent.futures import ProcessPoolExecutor

#PATH = "./halfhourly_dataset"
#csv_files = glob.glob(os.path.join(PATH, "block_*.csv"))
#output_dir = "./individuals"
#os.makedirs(output_dir, exist_ok=True)

#def process_file(file):
#	df = pd.read_csv(file)
#	grouped = df.groupby('LCLid')
#	for LCLid, group in grouped:
#		output_file = os.path.join(output_dir, f"{LCLid}.csv")
#		group.to_csv(output_file, index=False)
#	return file, len(grouped)

#with ProcessPoolExecutor() as executor:
#	results = list(executor.map(process_file, csv_files))

#for file, count in results:
#	print(f"Processed {file} into {count} files")
