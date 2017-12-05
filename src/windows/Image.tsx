/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of Image.
*/

import React = require('react');
import RN = require('react-native');
import Types = require('../common/Types');
import PropTypes = require('prop-types');

import {Image as ImageCommon} from '../native-common/Image';

export interface ImageContext {
    isRxParentAText?: boolean;
}

export class Image extends ImageCommon implements React.ChildContextProvider<ImageContext> {
    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
    };

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: true };
    }
}

export default Image;
