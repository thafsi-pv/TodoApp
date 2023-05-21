# Todo App

This is a Todo App which uses React for the front-end and Node.js with Express.js for the back-end API. It allows users to add, delete, edit and mark todos as completed. It also provides filter options for all, active and completed todos.

## Features

### Add todo

Users can add a new todo item by clicking on the input field and typing a description for the task, then pressing add button.

### Delete todo

Users can delete a todo item by clicking on the "Delete" button next to the item.

### Edit todo

Users can edit a todo item by clicking on the "Edit" button next to the item, making changes to the description in the input field that appears, and then pressing Enter to save the changes.

### Mark completed as strike through todo item

Users can mark a todo item as completed by clicking on the checkbox next to the item. The app will automatically display it as a strikethrough text.

### Filter option all, active ,completed

Users can filter the todo list by clicking on the corresponding button. The "All" button shows all tasks, the "Active" button shows incomplete tasks, and the "Completed" button shows completed tasks.

### Clear all completed todo

Users can clear all completed tasks by clicking on the "Clear Completed" button.

### Shows count of active todo bottom

The app displays the number of active tasks at the bottom of the todo list.

### Back-end API

The back-end API using the Node.js with Express.js framework and supports the following methods on the `/api/todo` endpoint:

- `GET` to retrieve all todos
- `POST` to create a new todo
- `DELETE` to delete a specific todo by ID
- `PATCH` to update a specific todo's isCompleted property
- `PUT` to update a specific todo's description
- `DELETE` to delete all completed todos

## Implementation Details

The app uses a JSON file to store the list of todos, and all CRUD operations are performed through API calls to the back-end.

List of Node.js modules used:

- `fs` module for reading and writing the JSON file
- `express`, and `cors` modules for implementing the API and handling request and response objects
- `axios` module for handling API requests and responses on the front-end
