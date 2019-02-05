import {
    Store,
    createStore,
} from 'redux';

import {
    todoList,
    ToDo
} from '../todo/todo-state';
import { ReducerFactory } from './AppFactory';

export interface ToDoListState {
    todoList: ToDo[];
}
export interface AppState extends ToDoListState { }

const storeFactory = (reducerFactory: ReducerFactory): Store<AppState> => createStore(reducerFactory());

export { storeFactory };
