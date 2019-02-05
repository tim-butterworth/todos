import React from 'react';

export interface ToDoProps {
    title: string;
    description: string;
    id: number;
    deleteToDo: (id: number) => void;
}

const ToDoItem = (props: ToDoProps) => (
    <div className="todo-item" onClick={(event) => props.deleteToDo(props.id)}>
        <div>{props.title}</div>
        <div>{props.description}</div>
    </div>
)

export {
    ToDoItem
};
