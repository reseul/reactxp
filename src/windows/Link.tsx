/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop-specific implementation of the cross-platform Link abstraction.
*/

import React = require('react');
import RN = require('react-native');
import RNW = require('react-native-windows');
import {applyFocusableComponentMixin, FocusManagerFocusableComponent} from '../native-desktop/utils/FocusManager';

import EventHelpers from '../native-desktop/utils/EventHelpers';
import {Link as LinkCommon } from '../native-common/Link';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

export class Link extends LinkCommon implements FocusManagerFocusableComponent {

    private _focusableElement : RNW.FocusableViewWindows = null;

    private _onFocusableRef = (btn: RNW.FocusableViewWindows): void => {
        this._focusableElement = btn;
    }

    render() {

        let tabIndex: number = this.getTabIndex() || 0;
        let windowsTabFocusable: boolean =  tabIndex >= 0;

        // RNW.FocusableViewWindows doesn't participate in layouting, it basically mimics the position/width of the child

        let focusableViewProps: RNW.FocusableViewProps = {
            ref: this._onFocusableRef,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp,
            onFocus: this._onFocus,
        };

        return (
            <RNW.FocusableViewWindows
                {...focusableViewProps}
            >
                <RN.Text
                    style={ this.props.style }
                    ref='nativeLink'
                    numberOfLines={ this.props.numberOfLines === 0 ? null : this.props.numberOfLines }
                    onPress={ this._onPress }
                    onLongPress={ this._onLongPress }
                    allowFontScaling={ this.props.allowFontScaling }
                    maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                >
                    { this.props.children }
                </RN.Text>
            </RNW.FocusableViewWindows>
        );
    }

    focus() {
        if (this._focusableElement &&
            this._focusableElement.focus) {
                this._focusableElement.focus();
        }
    }

    blur() {
        if (this._focusableElement &&
            this._focusableElement.blur) {
                this._focusableElement.blur();
        }
    }

    private _onKeyDown = (e: React.SyntheticEvent): void => {
        if (this.props.onPress) {
            let keyEvent = EventHelpers.toKeyboardEvent(e);
            let key = keyEvent.keyCode;
            // ENTER triggers press on key down
            if (key === KEY_CODE_ENTER) {
                // Defer to base class
                this._onPress(keyEvent);
                return;
            }
        }
    }

    private _onKeyUp = (e: React.SyntheticEvent): void => {
        if (this.props.onPress) {
            let keyEvent = EventHelpers.toKeyboardEvent(e);
            if (keyEvent.keyCode === KEY_CODE_SPACE) {
                 // Defer to base class
                this._onPress(keyEvent);
            }
        }
    }

    private _onFocus = (e: React.SyntheticEvent): void => {
        this.onFocus();
    }

    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Focus Manager may override this
        return 0;
    }
}

applyFocusableComponentMixin(Link);

export default Link;
