import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    AddToDo
    , AddToDoStateProps
    , AddToDoDispatchProps
} from './addToDo';

import {
    ToDo
} from '../todo-state';

import {
    updateTitleAction
    , newToDoAction
    , updateDescriptionAction
    , ToDoContent
} from './addToDo-state';

import { AddToDoState } from './addToDo-state';

const mapStateToProps = ({ addToDo }: AddToDoState): AddToDoStateProps => addToDo;
const mapDispatchToProps = (dispatch: Dispatch): AddToDoDispatchProps => ({
    add: (todoContent: ToDoContent) => dispatch(newToDoAction(todoContent)),
    updateTitle: (title: string) => dispatch(updateTitleAction(title)),
    updateDescription: (description: string) => dispatch(updateDescriptionAction(description))
});

const AddToDoComponent = connect(mapStateToProps, mapDispatchToProps)(AddToDo)

export { AddToDoComponent };
