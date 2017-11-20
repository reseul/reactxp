/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of the cross-platform Button abstraction.
*/

import React = require('react');
import Types = require('../common/Types');
import {Button as ButtonBase} from '../native-common/Button';
import EventHelpers from '../native-desktop/utils/EventHelpers';
import UserInterface from '../native-desktop/UserInterface';
import RN = require('react-native');
import RNW = require('react-native-windows');
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

const _longPressTime = 1000;

let _isNavigatingWithKeyboard = false;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

export class Button extends ButtonBase implements FocusManagerFocusableComponent {

    protected _buttonElement : RNW.FocusableViewWindows = null;

    protected _onButtonRef = (btn: RNW.FocusableViewWindows): void => {
        this._buttonElement = btn;
    }

    setNativeProps(nativeProps: RNW.FocusableViewProps) {
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        }
    }

    protected _render(internalProps: any): JSX.Element {

        let tabIndex: number = this.getTabIndex() || 0;
        let windowsTabFocusable: boolean = !this.props.disabled && tabIndex >= 0;

        let focusableViewProps: RNW.FocusableViewProps = {
            ref: this._onButtonRef,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp,
            onFocus: this._onFocus,
            onBlur: this._onBlur
        };

        return (
            <RNW.FocusableViewWindows
                {...focusableViewProps}
            >
                <RN.Animated.View
                    {...internalProps}
                >
                    { this.props.children }
                </RN.Animated.View>
            </RNW.FocusableViewWindows>
        );
    }

    focus() {
        super.focus();
        if (this._buttonElement && this._buttonElement.focus) {
            this._buttonElement.focus();
        }

    }

    blur() {
        super.blur();
        if (this._buttonElement && this._buttonElement.blur) {
            this._buttonElement.blur();
        }
   }

    private _onKeyDown = (e: React.SyntheticEvent): void => {

        if (!this.props.disabled) {
            let keyEvent = EventHelpers.toKeyboardEvent(e);
            if (this.props.onKeyPress) {
                this.props.onKeyPress(keyEvent);
            }

            if (this.props.onPress) {
                let key = keyEvent.keyCode;
                // ENTER triggers press on key down
                if (key === KEY_CODE_ENTER) {
                    this.props.onPress(keyEvent);
                    return;
                }
            }
        }
    }

    private _onKeyUp = (e: React.SyntheticEvent): void => {

        let keyEvent = EventHelpers.toKeyboardEvent(e);
        if (keyEvent.keyCode === KEY_CODE_SPACE) {
            if (!this.props.disabled && this.props.onPress) {
                this.props.onPress(keyEvent);
            }
        }
    }

    private _onFocus = (e: React.SyntheticEvent): void => {
        this.onFocus();
        if (this.props.onFocus) {
            this.props.onFocus(EventHelpers.toFocusEvent(e));
        }
    }

    private _onBlur = (e: React.SyntheticEvent): void => {
        if (this.props.onBlur) {
            this.props.onBlur(EventHelpers.toFocusEvent(e));
        }
    }

    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Focus Manager may override this
        return this.props.tabIndex;
    }
}

applyFocusableComponentMixin(Button);

export default Button;
