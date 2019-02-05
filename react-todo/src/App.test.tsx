import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux';
import { todoList } from './todo/todo-state';

describe('app', () => {

    let application;
    let div: Element;

    beforeEach(() => {
        div = document.createElement('div');

        ReactDOM.render(
            <Provider store={createStore(combineReducers({ todoList }))}>
                <App />
            </Provider>
            ,
            div
        );
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders todos', () => {
	
    });
});

