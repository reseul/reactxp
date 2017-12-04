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
    StoredFocusableComponent,
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

export interface FocusManagerFocusableComponentState {
    overridenTabIndex?: number;
}

export interface FocusManagerFocusableComponent {
    getTabIndex(): number | undefined;
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

    protected /* static */  _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
        if ((storedComponent.restricted || (storedComponent.limitedCount > 0)) && !('origTabIndex' in storedComponent)) {
            storedComponent.origTabIndex = FocusManager._setComponentTabIndexOverride(storedComponent.component, -1);
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, true);
        } else if (!storedComponent.restricted && !storedComponent.limitedCount && ('origTabIndex' in storedComponent)) {
            FocusManager._removeComponentTabIndexOverride(storedComponent.component);
            delete storedComponent.origTabIndex;
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, false);
        }
    }

    private  static  _setComponentTabIndexOverride(
            component: React.Component<any, any>, tabIndex: number): number {

        if ((component as any).setTabIndexOverride) {
            return (component as any).setTabIndexOverride(tabIndex);
        }
        return undefined;
    }

    private  static  _removeComponentTabIndexOverride(
            component: React.Component<any, any>): void {
        if ((component as any).removeTabIndexOverride) {
            return (component as any).removeTabIndexOverride();
        }
    }
}

export function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function) {
    // Call base
    applyFocusableComponentMixinBase(Component, isConditionallyFocusable);

    // Hook 'onFocus'
    inheritMethod('onFocus', function (origCallback: Function) {
        if (this._onFocusSink) {
            this._onFocusSink();
        } else {
            console.error('FocusableComponentMixin: focus sink error!');
        }

        if (origCallback) {
            origCallback.apply(this);
        }
    });

    // Hook 'getTabIndex'
    inheritMethod('getTabIndex', function (origCallback: any, ...args: any[]) {
        // Check override available
        let state = this.state as FocusManagerFocusableComponentState;
        if (state && state.overridenTabIndex !== undefined) {
            // Override available, use this one
            return state.overridenTabIndex;
        } else {
            // Override not available, defer to original handler to return the prop
            return origCallback.apply(this);
        }
    });

    // Hook 'shouldUpdateComponent'
    inheritMethod('shouldComponentUpdate', function (origCallback: any, nextProps: any, nextState: any) {
        // Check original callback
        if (origCallback) {
            // Return fast if effective tabIndex changed
            let nextTabIndex = (nextState as FocusManagerFocusableComponentState).overridenTabIndex !== undefined ?
            (nextState as FocusManagerFocusableComponentState).overridenTabIndex : nextState.tabIndex;

            if (this.getTabIndex && nextTabIndex !== this.getTabIndex()) {
                return true;
            }

            // Defer to original callback
            return origCallback.apply(this, nextProps, nextState);
        } else {
            // There's no way to optimize by detecting when the component update is happening solely because of an override of
            // a -1 with another -1.
            // We're defaulting to the safe approach
            return true;
        }

    }, true);

    // Implement 'setTabIndexOverride'
    inheritMethod('setTabIndexOverride', function (origCallback: any, args: any[]) {
        this.setState((prevState: any, props: any) => {
            return {overridenTabIndex: args[0]};
        });
        return this.props.tabIndex;
    }, true);

    // Implement 'removeTabIndexOverride'
    inheritMethod('removeTabIndexOverride', function (origCallback: any) {
        this.setState((prevState: any, props: any) => {
            let undef: number = undefined; // Ideally we'd like to remove the key, but there's no way.
            return {overridenTabIndex: undef};
        });
    }, true);

    // Hook 'focus'
    inheritMethod('focus', function (origCallback: Function) {
        // Both ReactXP API and the UWP implementation (the only desktop platform for now) allow for two types of enabled controls:
        // 1. the tab-stoppable ones, focusable (including programmaticaly), supporting keyboard input
        // 2. non tab-stoppable, non focusable in any way, no keyboard input supported
        //
        // FocusManager logic relies on web DOM support of a third case (tabIndex<0 means nont tabstoppable but still keyboard focusable),
        // so we can get "focus" calls on components with an overriden tabIndex of -1.
        //
        // In order to minimize rerenders we use a setState where we reset any overriden tabIndex and we delay the "focus" call to the
        // associated callback.
        //
        if (origCallback) {
            if (this.state.overridenTabIndex === -1) {
                this.setState((prevState: any, props: any) => {
                    let undef: number = undefined; // Ideally we'd like to remove the key, but there's no way.
                    return {overridenTabIndex: undef};
                }, () => {
                    origCallback.apply(this);
                });
            } else {
                origCallback.apply(this);
            }
        } else {
            console.error('FocusableComponentMixin: focus error!');
        }
    });

    function inheritMethod(methodName: string, action: Function, optional?: boolean) {
        let origCallback = Component.prototype[methodName];

        if (origCallback || optional) {
            Component.prototype[methodName] = function () {
                return action.call(this, origCallback, arguments);
            };
        } else {
            console.error('FocusableComponentMixin: ' + methodName + ' error!');
        }
    }
}

export default FocusManager;
