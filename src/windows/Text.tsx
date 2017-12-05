/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of Text.
*/

import React = require('react');
import RN = require('react-native');
import Types = require('../common/Types');
import PropTypes = require('prop-types');

import {Text as TextCommon} from '../native-common/Text';

export interface TextContext {
    isRxParentAText?: boolean;
}

export class Text extends TextCommon implements React.ChildContextProvider<TextContext> {
    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
    };

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is an Types.Text.
        // Because they're in an Types.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    }
}

export default Text;
