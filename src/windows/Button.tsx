/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of the cross-platform Button abstraction.
*/

import React = require('react');
import {Button as ButtonBase} from '../native-common/Button';
import RN = require('react-native');
import RNW = require('react-native-windows');

var ReactAnimatedFocusableView = RN.Animated.createAnimatedComponent(RNW.FocusableViewWindows);

export class Button extends ButtonBase {

    protected _render(internalProps: any): JSX.Element {

        // XXX: deal with tab index property
        let viewProps: RNW.FocusableViewProps = {
            ...internalProps,
            isTabStop: true
        };

        return (
            <ReactAnimatedFocusableView
                {...viewProps}
            >
                { this.props.children }
            </ReactAnimatedFocusableView>
        );
    }
}

export default Button;
