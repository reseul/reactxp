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
import PropTypes = require('prop-types');

import {View as ViewCommon} from '../native-common/View';
import Button from './Button';
import EventHelpers from '../native-desktop/utils/EventHelpers';
import { FocusManager, applyFocusableComponentMixin } from '../native-desktop/utils/FocusManager';

export interface ViewContext {
    isRxParentAText?: boolean;
    focusManager?: FocusManager;
}

export class View extends ViewCommon implements React.ChildContextProvider<ViewContext> {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool,
        focusManager: PropTypes.object
    };
    context: ViewContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
        focusManager: PropTypes.object
    };

    private _onKeyDown: (e: Types.SyntheticEvent) => void;

    private _buttonElement: Button;

    private _focusManager: FocusManager;
    private _isFocusLimited: boolean;

    constructor(props: Types.ViewProps, context: ViewContext) {
        super(props);

        if (props.restrictFocusWithin || props.limitFocusWithin) {
            this._focusManager = new FocusManager(context && context.focusManager);

            if (props.limitFocusWithin) {
                this.setFocusLimited(true);
            }
        }
    }

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

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        let childContext: ViewContext = {
            isRxParentAText: false
        };

        // Provide the descendants with the focus manager (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;
        }

        return childContext;
    }

    setFocusRestricted(restricted: boolean) {
        if (!this._focusManager || !this.props.restrictFocusWithin) {
            console.error('View: setFocusRestricted method requires restrictFocusWithin property to be set to true');
            return;
        }

        if (restricted) {
            this._focusManager.restrictFocusWithin();
        } else {
            this._focusManager.removeFocusRestriction();
        }
    }

    setFocusLimited(limited: boolean) {
        if (!this._focusManager || !this.props.limitFocusWithin) {
            console.error('View: setFocusLimited method requires limitFocusWithin property to be set to true');
            return;
        }

        if (limited && !this._isFocusLimited) {
            this._isFocusLimited = true;
            this._focusManager.limitFocusWithin();
        } else if (!limited && this._isFocusLimited) {
            this._isFocusLimited = false;
            this._focusManager.removeFocusLimitation();
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

    private onFocus() {
        // Focus manager hook
    }
}

applyFocusableComponentMixin(View, function (nextProps?: Types.ViewProps) {
    let tabIndex: number = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined && tabIndex !== -1;
});

export default View;
