import { combineReducers } from 'redux';

import { todoList } from '../todo/todo-state';
import { addToDo } from '../todo/add/addToDo-state';
import { todoId } from '../todo/add/todoId-state';
import { ReducerFactory } from './AppFactory';
import { AppState } from './AppState';

const reducerFactory: ReducerFactory<AppState> = () => combineReducers({
    todos: todoList,
    addToDo,
    todoId
});

export { reducerFactory };
