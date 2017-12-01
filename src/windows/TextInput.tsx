/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop-specific implementation of the cross-platform TextInput abstraction.
*/

import React = require('react');
import RN = require('react-native');
import RNW = require('react-native-windows');
import Types = require('../common/Types');

import {applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

import {TextInput as TextInputBase} from '../native-common/TextInput';

RNW.TextInput = RN.TextInput;

export class TextInput extends TextInputBase implements FocusManagerFocusableComponent {

    protected _render(props: RN.TextInputProps): JSX.Element {

        return (
            <RNW.TextInput
                {...props}
                tabIndex = {this.getTabIndex()}
                onFocus = { (e: Types.FocusEvent) => this._onEnhancedFocus(e, props.onFocus)}
            />)
            ;
    }

    private _onEnhancedFocus (e: Types.FocusEvent, origHandler: (e: React.FocusEvent) => void) {
        this.onFocus();

        if (origHandler) {
            origHandler(e);
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

applyFocusableComponentMixin(TextInput);

export default TextInput;
