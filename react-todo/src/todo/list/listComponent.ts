import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    ToDoList
    , ListProps
    , ListDispatch
} from './list';
import { ToDo } from '../todo-state'
import { ToDoListState } from '../../app/StoreFactory';
import { TODO_ACTION } from '../todo-state';

const mapStateToProps = (state: ToDoListState): ListProps => ({ todos: state.todoList });
const mapDispatchToProps = (dispatch: Dispatch): ListDispatch => ({
    deleteToDo: (id: number) => {
        dispatch({ type: TODO_ACTION.DELETE, id });
    }
});

const ListComponent = connect(mapStateToProps, mapDispatchToProps)(ToDoList)

export { ListComponent };
