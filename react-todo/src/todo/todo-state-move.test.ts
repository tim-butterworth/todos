import * as R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';

import { Store } from 'redux';
import { Provider } from 'react-redux';
import { AppState } from '../app/AppState';
import { ToDo } from './todo-state';
import { moveCommand } from './moveToDoCommandHandler';
import { newToDoCommand } from './newToDoCommandHandler';

import { getTestConnectedComponent } from '../test-tools/TestConnectedComponent';
import { reducerFactory } from '../app/ReducerFactory';
import { middlewareFactory } from '../app/MiddlewareFactory';
import { getTestStore } from '../test-tools/TestStore';

import { updateTitleAction, updateDescriptionAction } from '../todo/add/addToDo-state';
import { MoveErrorTypes } from '../todo/move/moveToDo-state';

describe('[reorder-todo]', () => {
    let store: Store<any>;
    let div: Element;
    let stateHolder: Array<AppState>;

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

    const createNewTodos = (todoCount: number): void => {
        R.forEach(
            (v: number) => {
                store.dispatch(updateTitleAction(`title_${v}`));
                store.dispatch(updateDescriptionAction(`description_${v}`));
                store.dispatch(newToDoCommand());
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

    beforeEach(() => {
        stateHolder = renderTestElement();
    });

    describe('[invalid-move-commands]', () => {
        it('[initial value]', () => {
            expect(stateHolder[0].moveToDo.errors).toEqual([]);
        });

        describe('sends an error', () => {
            it('[reorder of 0 todos]', () => {
                store.dispatch(moveCommand({ current: 0, target: 1 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.NOT_ENOUGH_TODOS
                }]);
            });

            it('[reorder of 1 todo]', () => {
                createNewTodos(1);

                store.dispatch(moveCommand({ current: 0, target: 1 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.NOT_ENOUGH_TODOS
                }]);
            });

            it('[current less than 0]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: -1, target: 3 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.CURRENT_LESS_THAN_ZERO
                }]);
            });

            it('[current greater than number of todos]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 5, target: 2 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.CURRENT_OUT_OF_BOUNDS
                }]);
            });

            it('[current equal to the number of todos]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 4, target: 2 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.CURRENT_OUT_OF_BOUNDS
                }]);
            });

            it('[target less than 0]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 2, target: -1 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.TARGET_LESS_THAN_ZERO
                }]);
            });

            it('[target greater than the number of todos]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 2, target: 5 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.TARGET_OUT_OF_BOUNDS
                }]);
            });

            it('[target equal to the number of todos]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 2, target: 4 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([{
                    errorType: MoveErrorTypes.TARGET_OUT_OF_BOUNDS
                }]);
            });
        });

        describe('does not send an error', () => {
            it('[current is 0]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 0, target: 3 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([]);
            });

            it('[current is equal to last todo index]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 3, target: 1 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([]);
            });

            it('[target is 0]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 3, target: 0 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([]);
            });

            it('[target is equal to last todo index]', () => {
                createNewTodos(4);

                store.dispatch(moveCommand({ current: 2, target: 3 }));

                expect(stateHolder[0].moveToDo.errors).toEqual([]);
            });
        });
    });

    describe('[valid-move-commands]', () => {
        describe('[moving up]', () => {
            it('[can move the last up 1 with 2 todos]', () => {
                createNewTodos(2);
                todosStartInTheRightOrder(stateHolder[0].todos);

                const current = 1;
                const target = 0;
                store.dispatch(moveCommand({ current, target }));

                const finalState: AppState = stateHolder[0];
                const finalTodos: ToDo[] = finalState.todos;

                expect(finalTodos.length).toEqual(2);
                expect(finalTodos[target]).toEqual(makeToDo(current));
                expect(finalTodos[current]).toEqual(makeToDo(target));
            });

            it('[can move the last up 1]', () => {
                createNewTodos(7);
                todosStartInTheRightOrder(stateHolder[0].todos);

                const current = 6;
                const target = 5;
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

                const finalState: AppState = stateHolder[0];
                const finalTodos: ToDo[] = finalState.todos;

                expect(finalTodos.length).toEqual(10);
                expect(finalTodos[target]).toEqual(makeToDo(current));

                areInRightOrder(finalTodos, { start: 0, finish: target - 1 });
                sectionIsInRightOrder(finalTodos, { start: target + 1, finish: current, offset: -1 });
            });
        });

        describe('[moving down]', () => {
            it('[can move the first down 1 with 2 todos]', () => {
                createNewTodos(2);
                todosStartInTheRightOrder(stateHolder[0].todos);

                const current = 0;
                const target = 1;
                store.dispatch(moveCommand({ current, target }));

                const finalState: AppState = stateHolder[0];
                const finalTodos: ToDo[] = finalState.todos;

                expect(finalTodos.length).toEqual(2);
                expect(finalTodos[target]).toEqual(makeToDo(current));
                expect(finalTodos[current]).toEqual(makeToDo(target));
            });

            it('[can move the first todo down 1]', () => {
                createNewTodos(5);
                todosStartInTheRightOrder(stateHolder[0].todos);

                const current = 0;
                const target = 1;
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

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
                store.dispatch(moveCommand({ current, target }));

                const finalState: AppState = stateHolder[0];
                const finalTodos: ToDo[] = finalState.todos;

                todosStartInTheRightOrder(finalTodos);
            });
        });
    });
});
