import React = require('react');
import RN = require('react-native');
import Types = require('../common/Types');

import {View as ViewCommon} from '../native-common/View';
import Button from './Button';
import EventHelpers from './utils/EventHelpers';

export class View extends ViewCommon {

    protected _buildInternalProps(props: Types.ViewProps) {

        // Base class does the bulk of _internalprops creation
        super._buildInternalProps(props);

        // Force a tabIndex of -1 if not specified at all
        if (this._internalProps.tabIndex === undefined) {
            this._internalProps.tabIndex = -1;
        }

        if (props.onKeyPress) {

            if (this._onKeyDown === undefined) {
                this._onKeyDown =  (e: Types.SyntheticEvent) => {
                    if (this.props.onKeyPress) {
                        this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
                    }
                };
            }
            // "onKeyDown" is fired by native buttons and bubbles up.
            // A conversion to a KeyboardEvent looking event is needed
            this._internalProps.onKeyDown = this._onKeyDown;
        }
    }

    protected _isButton (viewProps: Types.ViewProps): boolean {
        // We treat views with onKeyPress AND a specified tabIndex as buttons
        return super._isButton(viewProps) ||
            (!!viewProps.onKeyPress && viewProps.tabIndex !== undefined);
    }

    protected _renderButton() : JSX.Element {

        return (
                <Button { ...this._internalProps }>
                    { this.props.children }
                </Button>
            );
    }

    private _onKeyDown: (e: Types.SyntheticEvent) => void;

    focus() {
        super.focus();
    }

    blur() {
        super.blur();
    }
}

export default View;
