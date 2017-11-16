/**
* EventHelpers.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/
import _ = require('../../native-common/lodashMini');
import Types = require('../../common/Types');

const KEY_CODE_LEFT = 21;
const KEY_CODE_UP = 19;
const KEY_CODE_RIGHT = 22;
const KEY_CODE_DOWN = 20;

const DESKTOP_KEY_CODE_LEFT = 37;
const DESKTOP_KEY_CODE_UP = 38;
const DESKTOP_KEY_CODE_RIGHT = 39;
const DESKTOP_KEY_CODE_DOWN = 40;

export class EventHelpers {

    toKeyboardEvent(e: Types.SyntheticEvent): Types.KeyboardEvent {
        // Conversion to a KeyboardEvent-like event if needed
        let keyEvent = e as Types.KeyboardEvent;
        if (keyEvent.keyCode === undefined) {
            let keyCode = (e.nativeEvent as any).key;

            // Workaround for the keys having "react native mobile" values
            switch (keyCode) {
                case DESKTOP_KEY_CODE_LEFT:
                    keyCode = KEY_CODE_LEFT;
                    break;
                case DESKTOP_KEY_CODE_UP:
                    keyCode = KEY_CODE_UP;
                    break;
                case DESKTOP_KEY_CODE_RIGHT:
                    keyCode = KEY_CODE_RIGHT;
                    break;
                case DESKTOP_KEY_CODE_DOWN:
                    keyCode = KEY_CODE_DOWN;
                    break;
            }

            // We need to add keyCode to the original event, but React Native
            // reuses events, so we're not allowed to modify the original.
            // Instead, we'll clone it.
            keyEvent = _.clone(keyEvent);
            keyEvent.keyCode = keyCode;
            keyEvent.stopPropagation = () => {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };

            keyEvent.preventDefault = () => {
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };
        }
        return keyEvent;
    }

    toFocusEvent(e: Types.SyntheticEvent): Types.FocusEvent {
        let focusEvent = e as Types.FocusEvent;

        if (focusEvent.relatedTarget === undefined) {
            // Use null, always
            // We need to add relatedTarget to the original event, but React Native
            // reuses events, so we're not allowed to modify the original.
            // Instead, we'll clone it.
            focusEvent = _.clone(focusEvent);
            focusEvent.relatedTarget = null;
            focusEvent.stopPropagation = () => {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };

            focusEvent.preventDefault = () => {
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

        }
        return focusEvent;
    }
}

export default new EventHelpers();
