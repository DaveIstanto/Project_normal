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

The app will run in [http://localhost:3000](http://localhost:3000), as mentioned below.

**IMPORTANT NOTE FOR DEVELOPERS**: For front end development, follow the login page. In the login page, there are examples for using different components, fetching data from server, and styling. If confused, try to do it by analogy or let @DaveIstanto know.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify





