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

export interface UnHandledAction {
    type: "UNHANDLED";
}
export type CombinedActions<T> = T | UnHandledAction;

export interface AppState extends ToDoListState, AddToDoState, ToDoIdState { }
