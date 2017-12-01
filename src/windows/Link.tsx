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

import {Link as LinkCommon } from '../native-common/Link';

export class Link extends LinkCommon implements FocusManagerFocusableComponent {

    render() {
        return (
            <RNW.Text
                style={ this.props.style }
                ref='nativeLink'
                numberOfLines={ this.props.numberOfLines === 0 ? null : this.props.numberOfLines }
                onPress={ this._onPress }
                onLongPress={ this._onLongPress }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                tabIndex= { this.getTabIndex() }
                onFocus= { this._onFocus }
            >
                { this.props.children }
            </RNW.Text>
        );
    }

    focus() {
        if (this.refs['nativeLink'] &&
            (this.refs['nativeLink'] as RNW.Text).focus) {
                (this.refs['nativeLink'] as RNW.Text).focus();
        }
    }

    blur() {
        if (this.refs['nativeLink'] &&
            (this.refs['nativeLink'] as RNW.Text).blur) {
                (this.refs['nativeLink'] as RNW.Text).blur();
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
