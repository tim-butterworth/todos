import * as R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';

import { Store } from 'redux';
import { Provider } from 'react-redux';

import { getTestStore } from '../test-tools/TestStore';
import { AppState, Omit } from '../app/AppState';
import { getTestConnectedComponent } from '../test-tools/TestConnectedComponent';
import { reducerFactory } from '../app/ReducerFactory';
import { middlewareFactory } from '../app/MiddlewareFactory';
import { deleteAction, ToDo } from './todo-state';
import {
    updateTitleAction
    , updateDescriptionAction
} from './add/addToDo-state';
import { newToDoCommand } from './newToDoCommandHandler';

describe('[state] todo', () => {

    let store: Store<any>;
    let div: Element;

    beforeEach(() => {
        store = getTestStore(reducerFactory, middlewareFactory);

        div = document.createElement('div');
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(div);
    });

    const renderTestElement = (): Array<AppState> => {
        const stateHolder: Array<AppState> = [];
        ReactDOM.render(
            React.createElement(
                Provider,
                { store },
                React.createElement(getTestConnectedComponent((props: AppState) => {
                    stateHolder[0] = props;

                    return React.createElement("div")
                })),
            ),
            div
        );

        return stateHolder;
    }

    const withId: (partial: {
        title: string;
        description: string
    },
        id: number
    ) => ({
        title: string;
        description: string;
        id: number;
    }) = (partial, id) => ({ ...partial, id })

    describe('[todo-state-changes]', () => {
        let stateHolder: Array<AppState>;

        beforeEach(() => {
            stateHolder = renderTestElement();
        });

        it('initial state', () => {
            expect(stateHolder[0].addToDo).toEqual({
                title: "",
                description: ""
            });
            expect(stateHolder[0].todos).toHaveLength(0);
            expect(stateHolder[0].todoId).toEqual({ nextId: 0 })
        });

        describe('[addToDo]', () => {
            describe('[update values]', () => {
                it('can update the title with [updateTitleAction]', () => {
                    store.dispatch(updateTitleAction("updated title"));

                    expect(stateHolder[0].addToDo).toEqual({
                        title: "updated title",
                        description: ""
                    });
                });

                it('can update the description with [updateDescriptionAction]', () => {
                    store.dispatch(updateDescriptionAction("updated description"));

                    expect(stateHolder[0].addToDo).toEqual({
                        title: "",
                        description: "updated description"
                    });
                });

                it('can update both title and description', () => {
                    store.dispatch(updateTitleAction("updated title"));
                    store.dispatch(updateDescriptionAction("updated description"));

                    expect(stateHolder[0].addToDo).toEqual({
                        title: "updated title",
                        description: "updated description"
                    });
                });
            });

            it('updates values for next todo on [addAction]', () => {
                store.dispatch(updateTitleAction("updated title"));
                store.dispatch(updateDescriptionAction("updated description"));
                store.dispatch(newToDoCommand());

                expect(stateHolder[0].addToDo).toEqual({
                    title: "",
                    description: ""
                });
                expect(stateHolder[0].todoId).toEqual({ nextId: 1 });
            });
        });

        describe('[todos]', () => {
            it('can add a todo with [newToDoCommand]', () => {
                store.dispatch(updateTitleAction("this is the new title"));

                expect(stateHolder[0].addToDo).toEqual({
                    title: "this is the new title",
                    description: "",
                })

                store.dispatch(updateDescriptionAction("this is the new description"));

                expect(stateHolder[0].addToDo).toEqual({
                    title: "this is the new title",
                    description: "this is the new description",
                })

                store.dispatch(newToDoCommand());

                expect(stateHolder[0].todos).toHaveLength(1);
                expect(stateHolder[0].todos).toEqual([{
                    id: 0
                    , title: "this is the new title"
                    , description: "this is the new description"
                }]);
                expect(stateHolder[0].addToDo).toEqual({
                    title: "",
                    description: ""
                });
            });

            describe('[delete-todo]', () => {
                const getToDo1 = () => ({
                    title: 'title1'
                    , description: 'description1'
                });
                const getToDo2 = () => ({
                    title: 'title2'
                    , description: 'description2'
                });
                const getToDo3 = () => ({
                    title: 'title3'
                    , description: 'description3'
                });

                const addAToDo = ({ title, description }: Omit<ToDo, "id">) => {
                    store.dispatch(updateTitleAction(title));
                    store.dispatch(updateDescriptionAction(description));
                    store.dispatch(newToDoCommand());
                };

                beforeEach(() => {
                    addAToDo(getToDo1());
                    addAToDo(getToDo2());
                    addAToDo(getToDo3());

                    expect(stateHolder[0].todos).toHaveLength(3);
                    expect(stateHolder[0].todos).toEqual([
                        withId(getToDo1(), 0),
                        withId(getToDo2(), 1),
                        withId(getToDo3(), 2)
                    ]);
                });

                it('can delete the first todo', () => {
                    store.dispatch(deleteAction(0));

                    expect(stateHolder[0].todos).toHaveLength(2);
                    expect(stateHolder[0].todos).toEqual([
                        withId(getToDo2(), 1),
                        withId(getToDo3(), 2)
                    ]);
                });

                it('can delete the last todo', () => {
                    store.dispatch(deleteAction(2));

                    expect(stateHolder[0].todos).toHaveLength(2);
                    expect(stateHolder[0].todos).toEqual([
                        withId(getToDo1(), 0),
                        withId(getToDo2(), 1)
                    ]);
                });

                it('can delete the middle todo', () => {
                    store.dispatch(deleteAction(1));

                    expect(stateHolder[0].todos).toHaveLength(2);
                    expect(stateHolder[0].todos).toEqual([
                        withId(getToDo1(), 0),
                        withId(getToDo3(), 2)
                    ]);
                });

                it('can delete all todos', () => {
                    store.dispatch(deleteAction(0));
                    store.dispatch(deleteAction(1));
                    store.dispatch(deleteAction(2));

                    expect(stateHolder[0].todos).toHaveLength(0);
                    expect(stateHolder[0].todos).toEqual([]);
                });

                it('does nothing for invalid id', () => {
                    store.dispatch(deleteAction(10000));

                    expect(stateHolder[0].todos).toHaveLength(3);
                    expect(stateHolder[0].todos).toEqual([
                        withId(getToDo1(), 0),
                        withId(getToDo2(), 1),
                        withId(getToDo3(), 2)
                    ]);
                });
            });
        });
    });
});
