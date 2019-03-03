import {
    ToDo
    , ToDoListState
} from '../todo/todo-state';
import {
    AddToDoState
} from '../todo/add/addToDo-state';
import {
    ToDoIdState
} from '../todo/add/todoId-state';
import {
    MoveToDoState
} from '../todo/move/moveToDo-state';

export interface UnHandledAction {
    type: "UNHANDLED";
}
export type CombinedActions<T> = T | UnHandledAction;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface AppState extends ToDoListState, AddToDoState, ToDoIdState, MoveToDoState { }
