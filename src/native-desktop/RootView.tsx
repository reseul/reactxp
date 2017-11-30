/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/
import assert = require('assert');
import React = require('react');
import RN = require('react-native');
import PropTypes = require('prop-types');

import {RootView as RootViewCommon} from '../native-common/RootView';
import Input from './Input';
import UserInterface from './UserInterface';
import EventHelpers from './utils/EventHelpers';
import FocusManager from './utils/FocusManager';
import { SyntheticEvent } from 'reactxp/src/common/Types';

const KEY_CODE_TAB = 9;
const KEY_CODE_ESC = 27;

const styles = RN.StyleSheet.create({
    appWrapper: {
      flex: 1,
    },
  });

export class RootView extends RootViewCommon implements React.ChildContextProvider<any> {
    static childContextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object
    };

    private _focusManager: FocusManager;
    private _keyboardHandlerInstalled = false;
    private _isNavigatingWithKeyboard: boolean = false;
    private _isNavigatingWithKeyboardUpateTimer: number;

    constructor() {
        super();

        // Initialize the root FocusManager which is aware of all
        // focusable elements.
        this._focusManager = new FocusManager(null);
    }

    private _onTouchStartCapture = (e: SyntheticEvent) => {
        this._updateKeyboardNavigationState(false);
    }

    private _onKeyDownCapture = (e: SyntheticEvent) => {

        let kbdEvent = EventHelpers.toKeyboardEvent(e);
        if (kbdEvent.keyCode === KEY_CODE_TAB) {
            this._updateKeyboardNavigationState(true);
        }

        if (kbdEvent.keyCode === KEY_CODE_ESC) {
            /* TODO
            // If Esc is pressed and the focused element stays the same after some time,
            // switch the keyboard navigation off to dismiss the outline.
            const activeElement = document.activeElement; //XXX

            if (this._isNavigatingWithKeyboardUpateTimer) {
                window.clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
            }

            this._isNavigatingWithKeyboardUpateTimer = window.setTimeout(() => {
                this._isNavigatingWithKeyboardUpateTimer = undefined;

                if ((document.activeElement === activeElement) && activeElement && (activeElement !== document.body)) {
                    this._updateKeyboardNavigationState(false);
                }
            }, 500);
            */
            this._updateKeyboardNavigationState(false);
        }
    }

    private _updateKeyboardNavigationState(isNavigatingWithKeyboard: boolean) {
        if (this._isNavigatingWithKeyboardUpateTimer) {
            window.clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
            this._isNavigatingWithKeyboardUpateTimer = undefined;
        }

        if (this._isNavigatingWithKeyboard !== isNavigatingWithKeyboard) {
            this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;

            UserInterface.keyboardNavigationEvent.fire(isNavigatingWithKeyboard);

/* TODO: potentially useless properties
            const focusClass = isNavigatingWithKeyboard ? this.props.keyBoardFocusOutline : this.props.mouseFocusOutline;

            if (this.state.focusClass !== focusClass) {
                this.setState({ focusClass: focusClass });
            }
*/
        }
    }

    private _onKeyDown = (e: SyntheticEvent) => {
        let kbdEvent = EventHelpers.toKeyboardEvent(e);
        Input.dispatchKeyDown(kbdEvent);
    }

    private _onKeyUp = (e: SyntheticEvent) => {
        let kbdEvent = EventHelpers.toKeyboardEvent(e);

/* TODO fix popup processing
        if (this.props.activePopupOptions && (e.keyCode === KEY_CODE_ESC)) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            this._dismissPopup();
            return;
        }
*/
        Input.dispatchKeyUp(kbdEvent);
    }

    getChildContext() {
        // Provide the context with root FocusManager to all descendants.
        return {
            focusManager: this._focusManager
        };
    }

    render() {
        let content = super.render();

        let internalProps: any = {
            onKeyDown: this._onKeyDown,
            onKeyDownCapture: this._onKeyDownCapture,
            onKeyUp: this._onKeyUp,
            onTouchStartCapture: this._onTouchStartCapture
        };

        return (
            <RN.View 
                {...internalProps}
                style={styles.appWrapper}
            >
                {content}
            </RN.View>
        );
    }
}

export default RootView;
