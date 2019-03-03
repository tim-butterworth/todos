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
    , updateDescriptionAction
    , ToDoContent
} from './addToDo-state';
import { newToDoCommand } from '../newToDoCommandHandler';

import { AddToDoState } from './addToDo-state';

const mapStateToProps = ({ addToDo }: AddToDoState): AddToDoStateProps => addToDo;
const mapDispatchToProps = (dispatch: Dispatch): AddToDoDispatchProps => ({
    add: (todoContent: ToDoContent) => dispatch(newToDoCommand()),
    updateTitle: (title: string) => dispatch(updateTitleAction(title)),
    updateDescription: (description: string) => dispatch(updateDescriptionAction(description))
});

const AddToDoComponent = connect(mapStateToProps, mapDispatchToProps)(AddToDo)

export { AddToDoComponent };
