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
import { FocusManager } from '../native-desktop/utils/FocusManager';

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

    componentWillReceiveProps(nextProps: Types.ViewProps) {
        super.componentWillReceiveProps(nextProps);

        if (!!this.props.restrictFocusWithin !== !!nextProps.restrictFocusWithin) {
            console.error('View: restrictFocusWithin is readonly and changing it during the component life cycle has no effect');
        } else if (!!this.props.limitFocusWithin !== !!nextProps.limitFocusWithin) {
            console.error('View: limitFocusWithin is readonly and changing it during the component life cycle has no effect');
        }
    }

    componentDidMount() {
        if (this._focusManager) {
            if (this.props.restrictFocusWithin) {
                this._focusManager.restrictFocusWithin();
            }

            if (this.props.limitFocusWithin && this._isFocusLimited) {
                this._focusManager.limitFocusWithin();
            }
        }
    }

    componentWillUnmount() {
        if (this._focusManager) {
            this._focusManager.release();
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

        if (props.tabIndex === undefined) {
            // Force button to non focusable mode
            this._internalProps.tabIndex = -1;
        }
    }

    protected _isButton (viewProps: Types.ViewProps): boolean {
        // In addition to the general criteria (views with onPress or onLongPress are buttons)
        // we take into account the any non-undefined tabIndex
        // - views with defined tabIndex become buttons
        // - views with undefined tabIndex remain views, and the handlers relies on
        // bubbled "onKeyDown"/etc. react events from children
        return super._isButton(viewProps) ||
            (viewProps.tabIndex !== undefined);
    }

    protected _renderButton() : JSX.Element {

        // Uses the Windows specific Button
        return (
                <Button { ...this._internalProps }
                        onFocus = {this._onFocus}
                        onBlur = {this._onBlur}
                        ref = {this._setButtonElement}
                        >
                    { this.props.children }
                </Button>
            );
    }

    private _setButtonElement = (ref: Button) => {
        this._buttonElement = ref;

        // The current ref function overrides the original handler (ViewBase::_setNativeView), so we have to push this "Button"
        // as an "RN.View" for various subtle animations to continue working.
        // The choice of types is not fantastic, an interface with just setNativeProps would've been more honest (TODO).
        this._setNativeView(ref as any as RN.View);
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

// No focus manager mixin is needed here since the button like views delegate to RX.Button

export default View;
