/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of View.
*/

import React = require('react');
import RN = require('react-native');
import Types = require('../common/Types');

import {View as ViewCommon} from '../native-common/View';
import Button from './Button';
import EventHelpers from '../native-desktop/utils/EventHelpers';

export class View extends ViewCommon {

    private _onKeyDown: (e: Types.SyntheticEvent) => void;

    private _buttonElement: Button;

    protected _buildInternalProps(props: Types.ViewProps) {

        // Base class does the bulk of _internalprops creation
        super._buildInternalProps(props);

        if (props.onKeyPress) {

            // Define the handler for "onKeyDown" on first use, it's the safest way when functions
            // called from super constructors are involved.
            if (this._onKeyDown === undefined) {
                this._onKeyDown =  (e: Types.SyntheticEvent) => {
                    if (this.props.onKeyPress) {
                        // A conversion to a KeyboardEvent looking event is needed
                        this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
                    }
                };
            }
            // "onKeyDown" is fired by native buttons and bubbles up.
            this._internalProps.onKeyDown = this._onKeyDown;
        }
    }

    protected _isButton (viewProps: Types.ViewProps): boolean {
        // In addition to the general criteria (views with onPress or onLongPress are buttons)
        // we take into account the onKeyPress handler:
        // - views with defined onKeyPress and defined tabIndex are buttons
        // - views with defined onKeyPress and undefined tabIndex remain views, and the handler relies on
        // bubbled "onKeyDown" react events from children
        return super._isButton(viewProps) ||
            (!!viewProps.onKeyPress && viewProps.tabIndex !== undefined);
    }

    protected _renderButton() : JSX.Element {

        // Uses the Windows specific Button
        return (
                <Button { ...this._internalProps }
                        onFocus = {this._onFocus}
                        onBlur = {this._onBlur}
                        ref = {(ref: Button) => this._buttonElement = ref}
                        >
                    { this.props.children }
                </Button>
            );
    }

    focus() {
        super.focus();
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._buttonElement) {
            this._buttonElement.focus();
        }
    }

    blur() {
        super.blur();
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._buttonElement) {
            this._buttonElement.blur();
        }
    }

    private _onFocus = (e: React.SyntheticEvent): void => {
        if (this.props.onFocus) {
            this.props.onFocus(EventHelpers.toFocusEvent(e));
        }
    }

    private _onBlur = (e: React.SyntheticEvent): void => {
        if (this.props.onBlur) {
            this.props.onBlur(EventHelpers.toFocusEvent(e));
        }
    }
}

export default View;
