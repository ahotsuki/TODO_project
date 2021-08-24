# TODO APP

## Introduction

> This project makes use of express for the server, vanilla js for ui, and json file for the database. The server both serve ui and api endpoints. Accessing the server without _"/api/"_ will render the view and other files in the **public folder**. The ui is only a single paged html, and most of its functionalities are done through the DOM.

## Running the project

Before running the project, first install the dependencies using the command:

```
npm i
```

Using the commands below will run the server and logs on which port it is served.

```
npm start
// or
node .
// or
node index.js
```

The **.env** file in the project contains environment variables such as **TODO_PORT** and **TODO_DATABASE**. Changing the value of **TODO_PORT** will change the port of the server and **TODO_DATABASE** will change the database file name (should not contain folders and end with .json i.e. _db.json_, _dbb.json_, etc.).

If no database file is present, the app would automatically create a database based on the value of **TODO_DATABASE** environment variable.

To see the UI of the app, go to _http://localhost:${port}_. The UI is only single paged so every action is done through that page only.

## Testing

The file _test.rest_ is used alongside vscode _REST CLIENT_ to do manual testing on the endpoint. Be sure to configure the route with the proper port.

```
@route=http://localhost:{your port here}/api/todos
```

The _test.rest_ file already contains examples on all possible CRUD operations in the existing endpoint.

## Additional Notes

- The database file in _model/db.js_ is a database created with **fs** module. This is a node core module that makes reading and writing files with javascript possible.

- The _ui_ directory is served as a static file. Any file within that folder will be available to the client.

- The environment variable configuration is done with the help of the npm _dotenv_ library. It makes use of the _.env_ file in the root folder.
