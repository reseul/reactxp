/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation (RN desktop version)
*/

import React = require('react');
import RN = require('react-native');
import PropTypes = require('prop-types');

import Types = require('../../common/Types');

import {FocusManager as FocusManagerBase,
    applyFocusableComponentMixin as applyFocusableComponentMixinBase,
    OriginalAttributeValues} from '../../common/utils/FocusManager';

import UserInterface from '../UserInterface';

const ATTR_NAME_TAB_INDEX = 'tabindex';

let _isNavigatingWithKeyboard: boolean;
let _isShiftPressed: boolean;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

import {FocusableComponentStateCallback} from  '../../common/utils/FocusManager';
export {FocusableComponentStateCallback};

export interface FocusManagerFocusableComponent {
    onFocus(): void;
    focus(): void;
}

export class FocusManager extends FocusManagerBase {

    protected /* static */ addFocusListenerOnComponent(component: React.Component<any, any>, onFocus: EventListener): void {
        // We intercept the private "_onFocus" all the focusable elements have to have
        (component as any)._onFocusSink = onFocus;
    }

    protected /* static */ removeFocusListenerFromComponent(component: React.Component<any, any>, onFocus: EventListener): void {
        (component as any)._onFocusSink = undefined;
    }

    protected /* static */ focusComponent(component: React.Component<any, any>): boolean {
        let fc = component as any as FocusManagerFocusableComponent;

        if (fc && fc.focus) {
            fc.focus();
            return true;
        }
        return false;
    }

   /*
    private static focusFirst (last?: boolean) {
        const focusable = Object.keys(FocusManager._allFocusableComponents)
            .map(componentId => FocusManager._allFocusableComponents[componentId])
            .filter(storedComponent => !storedComponent.removed && !storedComponent.restricted && !storedComponent.limitedCount)
            .map(storedComponent => ReactDOM.findDOMNode<HTMLElement>(storedComponent.component))
            .filter(el => el && el.focus);

        if (focusable.length) {
            focusable.sort((a, b) => {
                // Some element which is mounted later could come earlier in the DOM,
                // so, we sort the elements by their appearance in the DOM.
                if (a === b) {
                    return 0;
                }
                return a.compareDocumentPosition(b) & document.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
            });

            focusable[last ? focusable.length - 1 : 0].focus();
        }
    } */

    protected /* static */ resetFocus() {

        /*
        if (FocusManager._resetFocusTimer) {
            clearTimeout(FocusManager._resetFocusTimer);
            FocusManager._resetFocusTimer = undefined;
        }

        if (_isNavigatingWithKeyboard) {
            // When we're in the keyboard navigation mode, we want to have the
            // first focusable component to be focused straight away, without the
            // necessity to press Tab.

            // Defer the focusing to let the view finish its initialization.
            FocusManager._resetFocusTimer = setTimeout(() => {
                FocusManager._resetFocusTimer = undefined;
                FocusManager.focusFirst();
            }, 0);
        } else if ((typeof document !== 'undefined') && document.body && document.body.focus && document.body.blur) {
            // An example to explain this part:
            // We've shown a modal dialog which is higher in the DOM by clicking
            // on a button which is lower in the DOM, we've applied the restrictions
            // and only the elements from the modal dialog are focusable now.
            // But internally the browser keeps the last focus position in the DOM
            // (even if we do blur() for the button) and when Tab is pressed again,
            // the browser will start searching for the next focusable element from
            // this position.
            // This means that the first Tab press will get us to the browser's address
            // bar (or nowhere in case of Electron) and only the second Tab press will
            // lead us to focusing the first focusable element in the modal dialog.
            // In order to avoid losing this first Tab press, we're making <body>
            // focusable, focusing it, removing the focus and making it unfocusable
            // back again.
            const prevTabIndex = FocusManager._setTabIndex(document.body, 0);
            document.body.focus();
            document.body.blur();
            FocusManager._setTabIndex(document.body, prevTabIndex);
        }

        */
    }

    protected /* static */ _setComponentTabIndexAndAriaHidden(
            component: React.Component<any, any>, tabIndex: number, ariaHidden: string): OriginalAttributeValues {
/*
        const el = ReactDOM.findDOMNode<HTMLElement>(component);
        return el ?
            {
                tabIndex: FocusManager._setTabIndex(el, tabIndex),
                ariaHidden: FocusManager._setAriaHidden(el, ariaHidden)
            }
            :
            null;*/
        return null;
    }
/*
    private static _setTabIndex(element: HTMLElement, value: number): number {
        const prev = element.hasAttribute(ATTR_NAME_TAB_INDEX) ? element.tabIndex : undefined;

        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_TAB_INDEX);
            }
        } else {
            element.tabIndex = value;
        }

        return prev;
    }

    private static _setAriaHidden(element: HTMLElement, value: string): string {
        const prev = element.hasAttribute(ATTR_NAME_ARIA_HIDDEN) ? element.getAttribute(ATTR_NAME_ARIA_HIDDEN) : undefined;

        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_ARIA_HIDDEN);
            }
        } else {
            element.setAttribute(ATTR_NAME_ARIA_HIDDEN, value);
        }

        return prev;
    }*/
}

export function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function) {
    // Call base
    applyFocusableComponentMixinBase(Component, isConditionallyFocusable);

    inheritMethod('onFocus', function () {
        if (this._onFocusSink) {
            this._onFocusSink();
        } else {
            console.error('FocusableComponentMixin: focus sink error!');
        }
    });

    function inheritMethod(methodName: string, action: Function) {
        let origCallback = Component.prototype[methodName];

        if (origCallback) {
            Component.prototype[methodName] = function () {
                action.call(this, arguments);

                if (origCallback) {
                    origCallback.apply(this, arguments);
                }
            };
        } else {
            console.error('FocusableComponentMixin: onFocus error!');
        }
    }
}

export default FocusManager;
