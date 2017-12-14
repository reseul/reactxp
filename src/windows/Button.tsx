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

const IsUpdatedReactNativeForWindows = (RNW.FocusableWindows !== undefined);

export class Button extends ButtonBase implements FocusManagerFocusableComponent {

    private _focusableElement : RNW.FocusableWindows = null;

    private _onFocusableRef = (btn: RNW.FocusableWindows): void => {
        this._focusableElement = btn;
    }

    protected _render(internalProps: any): JSX.Element {

        if (!IsUpdatedReactNativeForWindows) {
            return super._render(internalProps);
        }

        let styleSet = RNW.FocusableWindows.splitStyle(internalProps.style);

        let tabIndex: number = this.getTabIndex() || 0;
        let windowsTabFocusable: boolean = !this.props.disabled && tabIndex >= 0;

        // RNW.FocusableWindows doesn't participate in layouting, it basically mimics the position/size of the child

        let focusableViewProps: RNW.FocusableProps = {
            ref: this._onFocusableRef,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            disableSystemFocusVisuals: false,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp,
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            style: styleSet.focusableStyle
        };

        return (
            <RNW.FocusableWindows
                {...focusableViewProps}
            >
                <RN.Animated.View
                    {...internalProps}
                    style = {styleSet.childStyle}
                >
                    { this.props.children }
                </RN.Animated.View>
            </RNW.FocusableWindows>
        );
    }

    focus() {
        super.focus();
        if (this._focusableElement && this._focusableElement.focus) {
            this._focusableElement.focus();
        }

    }

    blur() {
        super.blur();
        if (this._focusableElement && this._focusableElement.blur) {
            this._focusableElement.blur();
        }
    }

    setNativeProps(nativeProps: RN.ViewProps) {
        if (this._focusableElement) {
            let nativePropsSet = RNW.FocusableWindows.splitNativeProps(nativeProps);
            if (nativePropsSet.focusableProps !== undefined) {
               this._focusableElement.setNativeProps(nativePropsSet.focusableProps);
            }

            if (nativePropsSet.childProps !== undefined) {
                super.setNativeProps(nativePropsSet.childProps);
            }
        } else {
            super.setNativeProps(nativeProps);
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
