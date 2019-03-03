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
    RESET = "RESET",
}

export interface UpdateTitleAction {
    type: ADD_TYPES.UPDATE_TITLE;
    title: string;
}
export interface UpdateDescriptionAction {
    type: ADD_TYPES.UPDATE_DESCRIPTION;
    description: string;
}
export interface ResetAction {
    type: ADD_TYPES.RESET;
}

const updateTitleAction = (title: string): UpdateTitleAction => ({
    type: ADD_TYPES.UPDATE_TITLE,
    title
});
const updateDescriptionAction = (description: string): UpdateDescriptionAction => ({
    type: ADD_TYPES.UPDATE_DESCRIPTION,
    description
});

const initialState: AddToDo = {
    description: "",
    title: ""
};

type AddToDoActions = CombinedActions<UpdateTitleAction | UpdateDescriptionAction | ResetAction>;
const addToDo: Reducer<AddToDo> = (state: AddToDo = initialState, action: AddToDoActions) => {
    switch (action.type) {
        case ADD_TYPES.UPDATE_TITLE: {
            return { ...state, title: action.title };
        }
        case ADD_TYPES.UPDATE_DESCRIPTION: {
            return { ...state, description: action.description };
        }
        case ADD_TYPES.RESET: {
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
};
