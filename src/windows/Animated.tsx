/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of Animated wrapper.
*/

import React = require('react');
import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import RXView from './View';
import {Animated as AnimatedBase} from '../native-common/Animated';

var ReactAnimatedView = RN.Animated.createAnimatedComponent(RXView);

export class AnimatedView extends AnimatedBase.View {
    render() {
        return (
            <ReactAnimatedView
                ref='nativeComponent'
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactAnimatedView>
        );
    }

    focus() {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.focus();
        }
    }

    blur() {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.blur();
        }
    }

    setFocusRestricted(restricted: boolean) {
        // Nothing to do for now
    }

    setFocusLimited(limited: boolean) {
        // Nothing to do for now
    }
}

export type AnimatedValue = typeof AnimatedBase.Value;

export var Animated = {
    Image: AnimatedBase.Image as typeof RX.AnimatedImage,
    Text: AnimatedBase.Text as typeof RX.AnimatedText,
    TextInput: AnimatedBase.TextInput as typeof RX.AnimatedTextInput,
    View: AnimatedView as typeof RX.AnimatedView,
    Value: AnimatedBase.Value as typeof Types.AnimatedValue,
    Easing: AnimatedBase.Easing as Types.Animated.Easing,
    timing: AnimatedBase.timing as Types.Animated.TimingFunction,
    delay: AnimatedBase.delay,
    parallel: AnimatedBase.parallel,
    sequence: AnimatedBase.sequence
};

export default Animated;
