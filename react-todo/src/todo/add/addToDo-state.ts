import * as R from 'ramda';
import { Reducer } from 'redux';

import { CombinedActions } from '../../app/AppState';
import {
    TODO_ACTION
    , AddAction
} from '../todo-state';

export interface ToDoContent {
    title: string;
    description: string;
}

interface AddToDo {
    title: string;
    description: string;
}
export interface AddToDoState {
    addToDo: AddToDo;
}

export enum ADD_TYPES {
    UPDATE_TITLE = "UPDATE_TITLE",
    UPDATE_DESCRIPTION = "UPDATE_DESCRIPTION",
    NEW_TODO = "NEW_TODO",
}

export interface UpdateTitleAction {
    type: ADD_TYPES.UPDATE_TITLE;
    title: string;
}
export interface UpdateDescriptionAction {
    type: ADD_TYPES.UPDATE_DESCRIPTION;
    description: string;
}
export interface NewToDoAction {
    type: ADD_TYPES.NEW_TODO;
    todoContent: ToDoContent;
}

const updateTitleAction = (title: string): UpdateTitleAction => ({
    type: ADD_TYPES.UPDATE_TITLE,
    title
});
const updateDescriptionAction = (description: string): UpdateDescriptionAction => ({
    type: ADD_TYPES.UPDATE_DESCRIPTION,
    description
});
const newToDoAction = (todoContent: ToDoContent): NewToDoAction => ({
    type: ADD_TYPES.NEW_TODO,
    todoContent
});

const initialState: AddToDo = {
    description: "",
    title: ""
};

type AddToDoActions = CombinedActions<UpdateTitleAction | UpdateDescriptionAction | AddAction>;
const addToDo: Reducer<AddToDo> = (state: AddToDo = initialState, action: AddToDoActions) => {
    switch (action.type) {
        case ADD_TYPES.UPDATE_TITLE: {
            return { ...state, title: action.title };
        }
        case ADD_TYPES.UPDATE_DESCRIPTION: {
            return { ...state, description: action.description };
        }
        case TODO_ACTION.ADD: {
            return {
                ...initialState,
            }
        }
        default: {
            return state;
        }
    }
}

export {
    addToDo
    , updateTitleAction
    , updateDescriptionAction
    , newToDoAction
};
