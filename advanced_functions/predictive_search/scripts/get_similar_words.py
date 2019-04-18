#!/usr/bin/env python3

# Load word_freq_df and tru_in dictionary
import pandas as pd
import json

word_freq_df = pd.read_csv("../saved_states/word_freq_df.csv")

with open('../saved_states/tru_in.json', 'r') as fp:
    tru_in = json.load(fp)

# Get P(B|A) distribution for specific B. Does not equal 1 because different A(s).

def get_P_BA(B):
    PBA_dict = dict()
    B = B.upper()
    for k, v in tru_in.items():
        PBA_for_given_A = tru_in[k].count(B) / len(tru_in[k])
        PBA_dict[k] = PBA_for_given_A
        
    return PBA_dict

# Get P(A) given specific A:

def get_PA(A):
    P_A = word_freq_df["Relative Frequency"][word_freq_df["Normalized word"] == A].values[0]
    return P_A
    

# Get relative P(A|B)

def get_PAB(B):
    B = B.upper()
    PBA_dict = get_P_BA(B)
    PAB_list = []
    for k, v in PBA_dict.items():
            if v != 0:
                P_A = get_PA(k)
                tup = (k, PBA_dict[k] * P_A)
                PAB_list.append(tup)

    PAB_list.append((B, 1))
    
    # Sort by value, descending
    PAB_list.sort(key=lambda tup: tup[1], reverse=True)
    
    #Get the words only
    words_only = [i[0] for i in PAB_list]
    
    return words_only


# Function to get combinations of input lists
import itertools


# print(list(itertools.product(*test)))


# Handle post request

from flask import Flask, request
from flask_cors import CORS
from json import dumps

app = Flask(__name__)
CORS(app)

@app.route('/getSimilarWordServer', methods=["POST"])
def getSimilarWordServer():
    input_string = request.form['searchString']
    word_list = get_PAB(input_string)

    if len(word_list) > 3:
        word_list = word_list[:3]

    # Get output ready as a string to communicate with JS
    word_list = str(word_list).replace("[", '').replace("]",'').replace(" ",'').replace("'", '')
    return word_list

if __name__ == "__main__":
	app.run()

