import { combineReducers } from 'redux';

import { todoList } from '../todo/todo-state';
import { ReducerFactory } from './AppFactory';

const reducerFactory: ReducerFactory = () => combineReducers({ todoList });

export { reducerFactory };
