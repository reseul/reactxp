/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of the cross-platform Text abstraction.
*/

import React = require('react');
import Types = require('../common/Types');
import {Text as TextBase} from '../native-common/Text';
import EventHelpers from '../native-desktop/utils/EventHelpers';
import AccessibilityUtil from '../native-common/AccessibilityUtil';
import RN = require('react-native');
import RNW = require('react-native-windows');
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

RNW.Text = RN.Text;

export class Text extends TextBase implements FocusManagerFocusableComponent {
    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (
            <RNW.Text
                style={ this._getStyles() }
                ref='nativeText'
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                onPress={ this.props.onPress }
                selectable={ this.props.selectable }
                textBreakStrategy={ 'simple' }
                ellipsizeMode={ this.props.ellipsizeMode }
                elevation={ this.props.elevation }
                tabIndex= {this.getTabIndex()}
                onFocus= {this._onFocus}
            >
                { this.props.children }
            </RNW.Text>
        );
    }

    focus() {
        super.focus();
        if (this.refs.nativeText &&
            (this.refs.nativeText as RNW.Text).focus) {
                (this.refs.nativeText as RNW.Text).focus();
        }
    }

    blur() {
        super.blur();
        if (this.refs.nativeText &&
            (this.refs.nativeText as RNW.Text).blur) {
                (this.refs.nativeText as RNW.Text).blur();
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

applyFocusableComponentMixin(Text, function (nextProps?: Types.TextProps) {
    return nextProps && nextProps.onPress !== undefined;
});

export default Text;
