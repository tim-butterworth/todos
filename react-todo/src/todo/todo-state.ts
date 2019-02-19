import {
    Reducer,
    Action
} from 'redux';
import * as R from 'ramda';

import { ToDoContent } from './add/addToDo-state';
import { CombinedActions } from '../app/AppState';

export interface ToDo {
    id: number;
    title: string;
    description: string;
}

export enum TODO_ACTION {
    DELETE = 'DELETE',
    ADD = 'ADD',
}

interface DeleteAction {
    type: TODO_ACTION.DELETE;
    id: number;
}
export interface AddAction {
    type: TODO_ACTION.ADD;
    todoContent: ToDo;
}

type ToDoListActions = CombinedActions<DeleteAction | AddAction>;

const deleteAction = (id: number): DeleteAction => ({
    type: TODO_ACTION.DELETE,
    id
});
const addAction = (todoContent: ToDo): AddAction => ({
    type: TODO_ACTION.ADD,
    todoContent
});

export interface ToDoListState {
    todos: ToDo[];
}

const todos: ToDo[] = [];

const todoList: Reducer<ToDo[]> = (
    state: ToDo[] = todos,
    action: ToDoListActions
): ToDo[] => {
    if (action.type === TODO_ACTION.DELETE) {
        return R.filter((todo: ToDo) => todo.id !== action.id, state)
    }
    if (action.type === TODO_ACTION.ADD) {
        return [...state, action.todoContent];
    }
    return state;
}

export {
    todoList
    , addAction
    , deleteAction
};
