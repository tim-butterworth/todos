import ReactTestUtils from 'react-dom/test-utils';

import * as R from 'ramda';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {
    createStore
    , combineReducers
    , Store
    , AnyAction
    , Reducer
} from 'redux';

import { todoList } from './todo/todo-state';
import { reducerFactory } from './app/ReducerFactory';
import { middlewareFactory } from './app/MiddlewareFactory';
import { storeFactory } from './app/StoreFactory';
import { AppState } from './app/AppState';
import { ToDoItem } from './todo/list/item/item';
import { app } from './App';
import {
    getTestStore
    , findChildWithClass
} from './test-tools/TestStore';

type Rendered = void | Element | Component<any, any, any>;

describe('app', () => {

    let application;
    let div: Element;
    let rendered: Rendered;
    let store: Store<AppState>;

    beforeEach(() => {
        const App: typeof Component = app(
            storeFactory,
            reducerFactory,
            middlewareFactory
        );

        div = document.createElement('div');

        rendered = ReactDOM.render(
            <App />,
            div
        );
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(div);
    });

    describe('[features]', () => {
        const findElementsBuilder = (findFun: (c: Component) => Array<Element>) => (maybeComponent: Rendered) => {
            if (maybeComponent instanceof Component) {
                return findFun(maybeComponent);
            } else {
                return [];
            }
        }
        const selectTodos = findElementsBuilder(
            (c: Component) => ReactTestUtils.scryRenderedDOMComponentsWithClass(c, "todo-item")
        );
        const selectInputs = findElementsBuilder(
            (c: Component) => ReactTestUtils.scryRenderedDOMComponentsWithTag(c, "input")
        );
        const selectSubmitButton = findElementsBuilder(
            (c: Component) => ReactTestUtils.scryRenderedDOMComponentsWithTag(c, "button")
        );
        const saveToDo = (title: string, description: string) => {
            console.log(`[saveToDo] -> title: [${title}] :: description: [${description}]`)
            const inputs: Array<Element> = selectInputs(rendered);

            const titleInput = inputs[0];
            const descriptionInput = inputs[1];

            titleInput.setAttribute('value', title);
            ReactTestUtils.Simulate.change(titleInput);

            descriptionInput.setAttribute('value', description);
            ReactTestUtils.Simulate.change(descriptionInput);

            const submitButton = selectSubmitButton(rendered)[0];

            ReactTestUtils.Simulate.click(submitButton);
        };

        it('todos can be added', () => {
            const inputs: Array<Element> = selectInputs(rendered);

            expect(inputs).toHaveLength(2);
            const title = inputs[0];
            const description = inputs[1];

            expect(title.textContent).toEqual("");
            expect(description.textContent).toEqual("");

            title.setAttribute('value', "some value");
            ReactTestUtils.Simulate.change(title);

            description.setAttribute('value', "some other value")
            ReactTestUtils.Simulate.change(description);

            const submitButtons = selectSubmitButton(rendered);
            expect(submitButtons).toHaveLength(1);

            const submitButton = submitButtons[0];

            ReactTestUtils.Simulate.click(submitButton);

            const todos: Array<Element> = selectTodos(rendered);

            expect(todos).toHaveLength(1);
            expect(todos[0].textContent).toContain("some value");
            expect(todos[0].textContent).toContain("some other value");
        });

        it('todos can be deleted', () => {
            console.log("saving first TODO now")
            saveToDo("title-to-delete", "description-to-delete");

            console.log("saving second TODO now")
            saveToDo("title-to-keep", "description-to-keep");

            const todos: Array<Element> = selectTodos(rendered);

            expect(todos).toHaveLength(2);

            const todoToDelete = todos[0];
            const todoToDeleteText = todoToDelete.textContent;
            const todoToKeepText = todos[1].textContent;

            expect(todoToDeleteText).not.toEqual(todoToKeepText);

            const deleteElement: Array<Element> = findChildWithClass(todoToDelete, "delete-todo")

            expect(deleteElement).toHaveLength(1);
            ReactTestUtils.Simulate.click(deleteElement[0]);

            const finalTodos: Array<Element> = selectTodos(rendered);

            expect(finalTodos).toHaveLength(1);
            expect(finalTodos[0].textContent).toEqual(todoToKeepText);
        });
    });
});

