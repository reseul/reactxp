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
    interface FocusableViewProps extends RN.ViewProps {
        isTabStop?                      : boolean;
        tabIndex?                       : number;
        tabNavigation?                  : string; // enum( 'local', 'cycle', 'once' );
        onFocus?                        : Function;
        onBlur?                         : Function;
        handledKeyDownKeys?             : number[];
        handledKeyUpKeys?               : number[];
        onKeyDown?                      : Function;
        onKeyUp?                        : Function;
     }

    class FocusableViewWindows extends RN.ReactNativeBaseComponent<FocusableViewProps, {}> { }
}
