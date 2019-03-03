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
    MOVE = 'MOVE',
}

export interface DeleteAction {
    type: TODO_ACTION.DELETE;
    id: number;
}
export interface AddAction {
    type: TODO_ACTION.ADD;
    todoContent: ToDo;
}
export interface IndexPair {
    current: number;
    target: number;
}
export interface MoveAction {
    type: TODO_ACTION.MOVE;
    move: IndexPair;
}

type ToDoListActions = CombinedActions<DeleteAction | AddAction | MoveAction>;

const deleteAction = (id: number): DeleteAction => ({
    type: TODO_ACTION.DELETE,
    id
});
const addAction = (todoContent: ToDo): AddAction => ({
    type: TODO_ACTION.ADD,
    todoContent
});
const moveAction = (pair: IndexPair): MoveAction => ({
    type: TODO_ACTION.MOVE,
    move: pair,
});

export interface ToDoListState {
    todos: ToDo[];
}

const todos: ToDo[] = [];

type range = { start: number; end: number; };
const getSubArrayFun = <T>(list: Array<T>) => ({ start, end }: range): Array<T> => {
    const result: Array<T> = [];
    let index = 0;
    R.forEach(
        (pointer: number) => {
            result[index] = list[pointer];
            index++;
        }
        , R.range(start, end + 1)
    )
    return result;
};

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
    if (action.type === TODO_ACTION.MOVE) {
        const { current, target } = action.move;

        if (current === target) {
            return state;
        } else if (current > target) {
            const value = state[current];

            const subArray = getSubArrayFun(state);

            const unchangedTop = subArray({ start: 0, end: target - 1 });
            const shiftedDown = subArray({ start: target, end: current - 1 });
            const unchangedBottom = subArray({ start: current + 1, end: state.length - 1 });

            return [...unchangedTop, value, ...shiftedDown, ...unchangedBottom];
        } else {
            const value = state[current];

            const subArray = getSubArrayFun(state);

            const unchangedTop = subArray({ start: 0, end: current - 1 });
            const shiftedUp = subArray({ start: current + 1, end: target });
            const unchangedBottom = subArray({ start: target + 1, end: state.length - 1 });

            return [...unchangedTop, ...shiftedUp, value, ...unchangedBottom];
        }
    }
    return state;
}

export {
    todoList
    , addAction
    , deleteAction
    , moveAction
};
