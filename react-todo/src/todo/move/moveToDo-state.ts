import { Reducer } from 'redux';
import { CombinedActions } from '../../app/AppState';

export enum MoveErrorTypes {
    NOT_ENOUGH_TODOS = "NOT_ENOUGH_TODOS",
    CURRENT_LESS_THAN_ZERO = "CURRENT_LESS_THAN_ZERO",
    CURRENT_OUT_OF_BOUNDS = "CURRENT_OUT_OF_BOUNDS",
    TARGET_LESS_THAN_ZERO = "TARGET_LESS_THAN_ZERO",
    TARGET_OUT_OF_BOUNDS = "TARGET_OUT_OF_BOUNDS"
};

interface NotEnoughToDos {
    errorType: MoveErrorTypes.NOT_ENOUGH_TODOS
};
interface CurrentLessThanZero {
    errorType: MoveErrorTypes.CURRENT_LESS_THAN_ZERO
};
interface CurrentOutOfBounds {
    errorType: MoveErrorTypes.CURRENT_OUT_OF_BOUNDS
};
interface TargetLessThanZero {
    errorType: MoveErrorTypes.TARGET_LESS_THAN_ZERO
};
interface TargetOutOfBounds {
    errorType: MoveErrorTypes.TARGET_OUT_OF_BOUNDS
};
export type MoveErrors = NotEnoughToDos
    | CurrentLessThanZero
    | CurrentOutOfBounds
    | TargetLessThanZero
    | TargetOutOfBounds;

interface MoveToDo {
    errors: MoveErrors[]
};
export interface MoveToDoState {
    moveToDo: MoveToDo;
};

export enum MoveActionTypes {
    TOO_FEW_TODOS = "TOO_FEW_TODOS",
    CURRENT_TOO_SMALL = "CURRENT_TOO_SMALL",
    CURRENT_TOO_LARGE = "CURRENT_TOO_LARGE",
    TARGET_TOO_SMALL = "TARGET_TOO_SMALL",
    TARGET_TOO_LARGE = "TARGET_TOO_LARGE"
};

interface TooFewToDosAction {
    type: MoveActionTypes.TOO_FEW_TODOS
};
interface CurrentTooSmallAction {
    type: MoveActionTypes.CURRENT_TOO_SMALL
};
interface CurrentTooLargeAction {
    type: MoveActionTypes.CURRENT_TOO_LARGE
};
interface TargetTooSmallAction {
    type: MoveActionTypes.TARGET_TOO_SMALL
};
interface TargetTooLargeAction {
    type: MoveActionTypes.TARGET_TOO_LARGE
}
const tooFewToDosToMove = (): TooFewToDosAction => ({
    type: MoveActionTypes.TOO_FEW_TODOS
});
const currentTooSmall = (): CurrentTooSmallAction => ({
    type: MoveActionTypes.CURRENT_TOO_SMALL
});
const currentTooLarge = (): CurrentTooLargeAction => ({
    type: MoveActionTypes.CURRENT_TOO_LARGE
});
const targetTooSmall = (): TargetTooSmallAction => ({
    type: MoveActionTypes.TARGET_TOO_SMALL
});
const targetTooLarge = (): TargetTooLargeAction => ({
    type: MoveActionTypes.TARGET_TOO_LARGE
});

const initialMoveToDo: MoveToDo = {
    errors: []
}
type MoveToDoActions = CombinedActions<
    TooFewToDosAction
    | CurrentTooSmallAction
    | CurrentTooLargeAction
    | TargetTooSmallAction
    | TargetTooLargeAction
>
const toDoMove: Reducer<MoveToDo> = (
    state: MoveToDo = initialMoveToDo,
    action: MoveToDoActions
): MoveToDo => {
    if (action.type === MoveActionTypes.TOO_FEW_TODOS) {
        return {
            errors: [{ errorType: MoveErrorTypes.NOT_ENOUGH_TODOS }]
        };
    }
    if (action.type === MoveActionTypes.CURRENT_TOO_SMALL) {
        return {
            errors: [{ errorType: MoveErrorTypes.CURRENT_LESS_THAN_ZERO }]
        };
    }
    if (action.type === MoveActionTypes.CURRENT_TOO_LARGE) {
        return {
            errors: [{ errorType: MoveErrorTypes.CURRENT_OUT_OF_BOUNDS }]
        };
    }
    if (action.type === MoveActionTypes.TARGET_TOO_SMALL) {
        return {
            errors: [{ errorType: MoveErrorTypes.TARGET_LESS_THAN_ZERO }]
        };
    }
    if (action.type === MoveActionTypes.TARGET_TOO_LARGE) {
        return {
            errors: [{ errorType: MoveErrorTypes.TARGET_OUT_OF_BOUNDS }]
        };
    }
    return state;
}

export {
    tooFewToDosToMove
    , currentTooSmall
    , currentTooLarge
    , targetTooSmall
    , targetTooLarge
    , toDoMove
};
