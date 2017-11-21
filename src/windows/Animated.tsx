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
import RXView from '../native-common/View';
import {Animated as AnimatedBase} from '../native-common/Animated';

var ReactAnimatedView = RN.Animated.createAnimatedComponent(RXView, true);

const refName = 'animatedComponent';

export class AnimatedView extends RX.AnimatedView {

    setNativeProps(props: Types.AnimatedViewProps) {
        const animatedComponent = this.refs[refName] as any;
        if (animatedComponent) {
            if (!animatedComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            animatedComponent.setNativeProps(props);
        }
    }

    render() {
        return (
            <ReactAnimatedView
                ref={ refName }
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactAnimatedView>
        );
    }

    focus() {
        const animatedComponent = this.refs[refName] as any;
        if (animatedComponent && animatedComponent._component) {
            animatedComponent._component.focus();
        }
    }

    blur() {
        const animatedComponent = this.refs[refName] as any;
        if (animatedComponent && animatedComponent._component) {
            animatedComponent._component.blur();
        }
    }

    setFocusRestricted(restricted: boolean) {
        const animatedComponent = this.refs[refName] as any;
        if (animatedComponent && animatedComponent._component) {
            animatedComponent._component.setFocusRestricted(restricted);
        }
    }

    setFocusLimited(limited: boolean) {
        const animatedComponent = this.refs[refName] as any;
        if (animatedComponent && animatedComponent._component) {
            animatedComponent._component.setFocusLimited(limited);
        }
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
