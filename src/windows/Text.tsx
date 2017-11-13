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
import EventHelpers from './utils/EventHelpers';
import AccessibilityUtil from '../native-common/AccessibilityUtil';
import RN = require('react-native');
import RNW = require('react-native-windows');

export class Text extends TextBase {
    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (
            <RN.Text
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
            >
                { this.props.children }
            </RN.Text>
        );
    }

    focus() {
        super.focus();
        if (this.refs.nativeText &&
            (this.refs.nativeText as RN.Text).focus) {
                (this.refs.nativeText as RN.Text).focus();
        }
    }

    blur() {
        super.blur();
        if (this.refs.nativeText &&
            (this.refs.nativeText as RN.Text).blur) {
                (this.refs.nativeText as RN.Text).blur();
        }
     }
}

export default Text;
