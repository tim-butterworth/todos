import React from 'react';
import * as R from 'ramda';

import './AddToDo.css';
import { ToDo } from '../todo-state';
import { ToDoContent } from './addToDo-state';

export interface AddToDoStateProps {
    title: string;
    description: string;
}
export interface AddToDoDispatchProps {
    add: (todo: ToDoContent) => void;
    updateTitle: (title: string) => void;
    updateDescription: (description: string) => void;
}
interface AddToDoProps extends AddToDoStateProps, AddToDoDispatchProps { }

type AddToDoType = (props: AddToDoProps) => JSX.Element;

const AddToDo: AddToDoType = (props: AddToDoProps): JSX.Element => (
    <div className="todo-add-container">
        <div className="todo-text-input">
            <label htmlFor="title">title</label>
            <input
                name="title"
                type="text"
                value={props.title}
                onChange={(event) => props.updateTitle(event.target.value)}
            />
        </div>
        <div className="todo-text-input">
            <label htmlFor="description">description</label>
            <input
                name="description"
                type="text"
                value={props.description}
                onChange={(event) => props.updateDescription(event.target.value)}
            />
        </div>
        <button
            onClick={(event) => props.add({
                title: props.title,
                description: props.description
            })}
        >
            SUBMIT
	</button>
    </div>
)

export { AddToDo };
