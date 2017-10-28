/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of the cross-platform Button abstraction.
*/

import React = require('react');
import {Button as ButtonBase} from '../native-common/Button';
import RN = require('react-native');
import RNW = require('react-native-windows');

const ReactAnimatedFocusableView = RN.Animated.createAnimatedComponent(RNW.FocusableViewWindows);

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

export class Button extends ButtonBase {

    protected _buttonElement : RNW.AnimatedFocusableView = null;

    protected _onButtonRef = (btn: RNW.AnimatedFocusableView): void => {
        this._buttonElement = btn;
    }

    setNativeProps(nativeProps: RNW.FocusableViewProps) {
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        }
    }

    protected _render(internalProps: any): JSX.Element {

        let tabIndex: number = this.props.tabIndex || 0;
        let windowsTabFocusable: boolean = !this.props.disabled && tabIndex >= 0;

        let viewProps: RNW.FocusableViewProps = {
            ...internalProps,
            ref: this._onButtonRef,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp
        };

        return (
            <ReactAnimatedFocusableView
                {...viewProps}
            >
                { this.props.children }
            </ReactAnimatedFocusableView>
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
        // noop
    }

    private _onKeyDown = (e: React.KeyboardEvent): void => {
        if (!this.props.disabled) {
            if (this.props.onKeyPress) {
                this.props.onKeyPress(e);
            }



            if (this.props.onLongPress) {
                this._lastMouseDownTime = Date.now().valueOf();
                this._lastMouseDownEvent = e;
                e.persist();

                this._longPressTimer = window.setTimeout(() => {
                    this._longPressTimer = undefined;
                    if (this.props.onLongPress) {
                        this.props.onLongPress(this._lastMouseDownEvent);
                        this._ignoreClick = true;
                    }
                }, _longPressTime);
            }

        }
        if (this.props.onKeyPress) {
            let key = (e.nativeEvent as any).key;

            if (key === KEY_CODE_SPACE) {
                this.props.onKeyPress(e);
            }
        }

        if (this.props.onPress) {
            let key = (e.nativeEvent as any).key;

            if (key === KEY_CODE_SPACE) {
                this.props.onPress(e);
            }
        }
    }

    private _onKeyUp = (e: React.KeyboardEvent): void => {
        if (this.props.onKeyPress) {
            let key = (e.nativeEvent as any).key;

            if (key === KEY_CODE_SPACE) {
                this.props.onKeyPress(e);
            }
        }

        if (this.props.onPress) {
            let key = (e.nativeEvent as any).key;

            if (key === KEY_CODE_SPACE) {
                this.props.onPress(e);
            }
        }
    }


}

export default Button;
