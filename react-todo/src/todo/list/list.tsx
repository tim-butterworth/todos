import * as R from 'ramda';
import React from 'react';

import {
    ToDoItem
    , ToDoProps
} from './item/item';
import { ToDo } from '../todo-state';

type updateStateFun = (arg: string) => void;

export interface ListProps { todos: ToDo[] };
export interface ListDispatch { deleteToDo: (id: number) => void; };
interface ListState extends ListProps, ListDispatch { };

const mappingFun = (data: ToDoProps, i: number): JSX.Element => (
    <ToDoItem key={i} {...data} />
)

const ToDoList = (listState: ListState): JSX.Element => {
    const { todos, deleteToDo } = listState;
    return (
        <div>
            {
                R.map(
                    (todo: ToDo) => {
                        const value: ToDoProps = Object.assign({}, todo, { deleteToDo });

                        return mappingFun(value, todo.id);
                    },
                    todos
                )
            }
        </div>
    )
}

export {
    ToDoList
};
