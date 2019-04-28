#!/usr/bin/env python3
import nltk
from nltk.corpus import wordnet
import gensim
from gensim.models import Word2Vec
import timeit
import gzip
import logging

#input is the input string that is used to decide if it is urgent or not (in our case, this is the task)
input = "Do it now"

#Synonyms is the list of synonyms extracted from wordnet that we use later to decide urgency
synonyms = []

#Path to Google trained wordnet - URL to download: https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit
path = "/Users/prakruthiburra/Downloads/GoogleNews-vectors-negative300.bin.gz"

#Code based almost entirely on on code at https://www.geeksforgeeks.org/get-synonymsantonyms-nltk-wordnet-python/
for syn in wordnet.synsets("now"):
    for l in syn.lemmas():
        synonyms.append(l.name())
synonyms = list(set(synonyms))

print(synonyms)

# Logging code taken from http://rare-technologies.com/word2vec-tutorial/
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# Load Google's pre-trained Word2Vec model.
#model = gensim.models.KeyedVectors.load_word2vec_format(path, binary=True)

#Using hotel review data
corpus = []
hotel_file="/Users/prakruthiburra/Downloads/reviews_data.txt.gz"
with gzip.open (hotel_file, 'rb') as f:
    for line in enumerate(f):
        line = line[1]
        line = line.replace("\t", "")
        line = line.replace("\r", "")
        line = line.replace("\n", "")
        line = line.lower()
        corpus.append(line)
#Tutorial at https://github.com/kavgan/nlp-in-practice/tree/master/word2vec was studied
model = gensim.models.Word2Vec(corpus, size=100, window=5, min_count=5, workers=10)
model.train(corpus,total_examples=len(corpus),epochs=1)

#Function to output time sensitivity
def time_sensitivity(task):
    print("time_sensitive function starts   \n")
    start = timeit.default_timer()
    task = task.lower()
    task = task.split(" ")
    max = 0
    for i in range(len(synonyms)):
        if synonyms[i] in model.wv.vocab:
            for j in range(len(task)):
                if task[j] in model.wv.vocab:
                     if(model.wv.similarity(synonyms[i], task[j]) > max):
                        max = model.wv.similarity(synonyms[i], task[j])
    end = timeit.default_timer()
    runtime = end - start
    print("Time sensitivity function used:", runtime, "seconds\n")
    if(max > 0.5):
        print(max)
        return 1 #Urgent
    else:
        return 0 #Not urgent

#Output of whether a task is urgent or not is stored in result
result = time_sensitivity(input)
print(result)
# Handle post request

#from flask import Flask, request
#from flask_cors import CORS
#from json import dumps

#app = Flask(__name__)
#CORS(app)

#@app.route('/getTimeSensitivityServer', methods=["POST"])
#def getTimeSensitivityServer():
#    input_string = request.form['taskName']
#    print(input_string)
#    time_sensitive = time_sensitivity(input_string)
#    print(time_sensitive)
#    return str(time_sensitive)

#if __name__ == "__main__":
#	app.run(host='127.0.0.1', port='5001')
