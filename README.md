## Instructions for Development / Demo

This project uses MVC model: Model, View, Controller

**Model:** gcloud-based mysql

**Controller:** Node.js (Express)

**View:** React

### Database connection (Model setup)

Setup gcloud SDK: https://cloud.google.com/sdk/docs/quickstart-macos

Setup cloud_sql_proxy: https://cloud.google.com/sql/docs/mysql/connect-admin-proxy

`./cloud_sql_proxy -instances="cs-411-database:us-central1:cs411normal"=tcp:3306`

Now mysql can treat gcloud-based mysql as if it's local

`mysql -u root -p --host 127.0.0.1`

no password, just hit return when prompted

### Node / Express (Controller setup)

Download [nodemon](https://nodemon.io/)

To boot up node.js server:

`nodemon DatabaseDriver.js`

The server listens to port 4000, so for requests to the database via controller, refer to:

[http://localhost:4000](http://localhost:4000)

for the root directory.

The specific addresses for each routes is specified within `DatabaseDriver.js`

### React (View setup)

In the cloned directory:

`npm start`

The app will run in [http://localhost:3000](http://localhost:3000).


### Extra setup for Advanced Functionality 1: Search of similar words

The script to get similar words is coded in python3. As we are using Javascript and React, the pages and the python script have to communicate via HTTP request protocols. Therefore, extra setup steps must be done, such as installing packages for **Python3**

```
pip install flask
pip install flask_cors
```

When done installing:

`python /advanced_functions/predictive_search/scripts/get_similar_words.py`

The python server will listen to: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### Extra setup for Advanced Functionality 2: String classification for time sensitivity 

The script to do advanced functionality 2 is also coded in python3. So flask is also needed. However, this function will be hosted in another port.

Execute:

`python advanced_functions/time_sensitivity/scripts/wordnet.py`

The python server will listen to: [http://127.0.0.1:5001](http://127.0.0.1:5001)

**Note:** Make sure you use python3



**IMPORTANT NOTE FOR DEVELOPERS**: For front end development, follow the login page. In the login page, there are examples for using different components, fetching data from server, and styling. If confused, try to do it by analogy or let @DaveIstanto know.
