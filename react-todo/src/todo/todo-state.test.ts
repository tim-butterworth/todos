import * as R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';

import { Store } from 'redux';
import { Provider } from 'react-redux';

import { getTestStore } from '../test-tools/TestStore';
import { AppState } from '../app/AppState';
import { getTestConnectedComponent } from '../test-tools/TestConnectedComponent';
import { reducerFactory } from '../app/ReducerFactory';
import { middlewareFactory } from '../app/MiddlewareFactory';
import { deleteAction, moveAction, ToDo } from './todo-state';
import {
    updateTitleAction
    , updateDescriptionAction
    , newToDoAction
} from './add/addToDo-state';

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
                store.dispatch(newToDoAction({
                    title: "title",
                    description: "description"
                }));

                expect(stateHolder[0].addToDo).toEqual({
                    title: "",
                    description: ""
                });
                expect(stateHolder[0].todoId).toEqual({ nextId: 1 });
            });
        });

        describe('[todos]', () => {
            it('can add a todo with [newToDoAction]', () => {
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

                store.dispatch(newToDoAction({
                    title: "some-title",
                    description: "some-description"
                }));

                expect(stateHolder[0].todos).toHaveLength(1);
                expect(stateHolder[0].todos).toEqual([{
                    id: 0
                    , title: "some-title"
                    , description: "some-description"
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

                beforeEach(() => {
                    store.dispatch(newToDoAction(getToDo1()));
                    store.dispatch(newToDoAction(getToDo2()));
                    store.dispatch(newToDoAction(getToDo3()));

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

            describe('[reorder-todo]', () => {
                const createNewTodos = (todoCount: number): void => {
                    R.forEach(
                        (v: number) => {
                            store.dispatch(newToDoAction({
                                title: `title_${v}`,
                                description: `description_${v}`
                            }));
                        },
                        R.range(0, todoCount)
                    );

                };

                const makeToDo = (index: number): ToDo => ({
                    id: index
                    , title: `title_${index}`
                    , description: `description_${index}`
                });
                const todosStartInTheRightOrder = (todos: ToDo[]): void => {
                    const mapIndexed = R.addIndex<ToDo, { value: ToDo; index: number; }>(R.map)
                    const todosWithIndex: {
                        value: ToDo;
                        index: number;
                    }[] = mapIndexed(<ToDo>(value: ToDo, index: number) => ({ index, value }), todos);

                    R.forEach(
                        ({ value, index }) => expect(value).toEqual(makeToDo(index))
                        , todosWithIndex
                    );
                };

                const sectionIsInRightOrder = (todos: ToDo[], { start, finish, offset }: {
                    start: number;
                    finish: number;
                    offset: number;
                }): void => {
                    R.forEach(
                        (v: number) => expect(todos[v]).toEqual(makeToDo(v + offset))
                        , R.range(start, finish + 1)
                    );
                };

                const areInRightOrder = (todos: ToDo[], { start, finish }: {
                    start: number;
                    finish: number;
                }): void => sectionIsInRightOrder(todos, { start, finish, offset: 0 });

                describe('[moving up]', () => {
                    it('[can move the last up 1]', () => {
                        createNewTodos(7);
                        todosStartInTheRightOrder(stateHolder[0].todos);

                        const current = 6;
                        const target = 5;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos.length).toEqual(7);
                        expect(finalTodos[target]).toEqual(makeToDo(current));
                        expect(finalTodos[current]).toEqual(makeToDo(target));

                        areInRightOrder(finalTodos, { start: 0, finish: target - 1 })
                    });

                    it('[can move the last to the top]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);

                        const current = 9;
                        const target = 0;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos.length).toEqual(10);
                        expect(finalTodos[target]).toEqual(makeToDo(current));

                        sectionIsInRightOrder(finalTodos, { start: 1, finish: 9, offset: -1 });
                    });

                    it('[can move the last to the middle]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);

                        const current = 9;
                        const target = 4;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos.length).toEqual(10);
                        expect(finalTodos[target]).toEqual(makeToDo(current));

                        areInRightOrder(finalTodos, { start: 0, finish: target - 1 });
                        sectionIsInRightOrder(finalTodos, { start: target + 1, finish: current, offset: -1 });
                    });

                    it('[can move a middle one to another middle spot]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);

                        const current = 7;
                        const target = 4;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos.length).toEqual(10);
                        expect(finalTodos[target]).toEqual(makeToDo(current));

                        areInRightOrder(finalTodos, { start: 0, finish: target - 1 });
                        sectionIsInRightOrder(finalTodos, { start: target + 1, finish: current, offset: -1 });
                    });
                });

                describe('[moving down]', () => {
                    it('[can move the first todo down 1]', () => {
                        createNewTodos(5);
                        todosStartInTheRightOrder(stateHolder[0].todos);

                        const current = 0;
                        const target = 1;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos.length).toEqual(5);
                        expect(finalTodos[target]).toEqual(makeToDo(0));
                        expect(finalTodos[current]).toEqual(makeToDo(1));

                        areInRightOrder(finalTodos, { start: 2, finish: 4 })
                    });

                    it('[can move the first todo to the end]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);
                        expect(stateHolder[0].todos).toHaveLength(10);

                        const current = 0;
                        const target = 9;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos).toHaveLength(10);
                        expect(finalTodos[target]).toEqual(makeToDo(0));

                        sectionIsInRightOrder(finalTodos, { start: 0, finish: target - 1, offset: 1 });
                    });

                    it('[can move the first todo to the middle]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);
                        expect(stateHolder[0].todos).toHaveLength(10);

                        const current = 0;
                        const target = 4;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos).toHaveLength(10);
                        expect(finalTodos[target]).toEqual(makeToDo(0));

                        sectionIsInRightOrder(finalTodos, { start: 0, finish: target - 1, offset: 1 });
                        areInRightOrder(finalTodos, { start: target + 1, finish: 9 });
                    });

                    it('[can move middle todo to the bottom]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);
                        expect(stateHolder[0].todos).toHaveLength(10);

                        const current = 4;
                        const target = 9;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos).toHaveLength(10);
                        expect(finalTodos[target]).toEqual(makeToDo(current));

                        areInRightOrder(finalTodos, { start: 0, finish: current - 1 });
                        sectionIsInRightOrder(finalTodos, { start: current, finish: target - 1, offset: 1 });
                    });

                    it('[can move middle todo to the middle]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);
                        expect(stateHolder[0].todos).toHaveLength(10);

                        const current = 4;
                        const target = 6;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        expect(finalTodos).toHaveLength(10);
                        expect(finalTodos[target]).toEqual(makeToDo(current));

                        areInRightOrder(finalTodos, { start: 0, finish: current - 1 });
                        sectionIsInRightOrder(finalTodos, { start: current, finish: target - 1, offset: 1 });
                        areInRightOrder(finalTodos, { start: target + 1, finish: 9 });
                    });
                });

                describe('[not moving]', () => {
                    it('[does nothing if current and target are the same]', () => {
                        createNewTodos(10);
                        todosStartInTheRightOrder(stateHolder[0].todos);
                        expect(stateHolder[0].todos).toHaveLength(10);

                        const current = 5;
                        const target = 5;
                        store.dispatch(moveAction({ current, target }));

                        const finalState: AppState = stateHolder[0];
                        const finalTodos: ToDo[] = finalState.todos;

                        todosStartInTheRightOrder(finalTodos);
                    });
                });
            });
        });
    });
});
