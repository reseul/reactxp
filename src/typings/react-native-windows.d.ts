/**
* react-native-windows.d.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition file for React Native, based on the React.js definition file on https://github.com/borisyankov/DefinitelyTyped.
*/

declare module 'react-native-windows' {
    //
    // React
    // ----------------------------------------------------------------------

    import React = require('react');
    import RN = require('react-native');

    //
    // Focusable view related declarations
    // ----------------------------------------------------------------------
    interface FocusableProps extends RN.ViewProps {
        isTabStop?                      : boolean;
        tabIndex?                       : number;
        tabNavigation?                  : string; // enum( 'local', 'cycle', 'once' );
        disableSystemFocusVisuals?      : boolean;
        onFocus?                        : Function;
        onBlur?                         : Function;
        handledKeyDownKeys?             : number[];
        handledKeyUpKeys?               : number[];
        onKeyDown?                      : Function;
        onKeyUp?                        : Function;
    }

    interface SplitStyleSet {
        focusableStyle: RN.StyleRuleSet;
        childStyle: RN.StyleRuleSet;
    }

    interface SplitPropsSet {
        focusableProps: RN.ViewProps | undefined;
        childProps: RN.ViewProps;
    }
    class FocusableWindows extends RN.ReactNativeBaseComponent<FocusableProps, {}> {
        static splitStyle(style: RN.StyleRuleSet | RN.StyleRuleSet[]): SplitStyleSet;
        static splitNativeProps(props: RN.ViewProps): SplitPropsSet;
    }

    interface ScrollViewProps extends RN.ScrollViewProps {
        onKeyDown?                      : Function;
        onKeyUp?                        : Function;
        tabNavigation?                  : string; // enum( 'local', 'cycle', 'once' );
        disableKeyboardBasedScrolling?  : boolean;
    }

    class ScrollView extends RN.ReactNativeBaseComponent<ScrollViewProps, {}> { }

    interface TextInputProps extends RN.TextInputProps {
        tabIndex?                       : number;
    }

    class TextInput extends RN.ReactNativeBaseComponent<TextInputProps, {}>
    {
        static State: RN.TextInputState;
    }
}
