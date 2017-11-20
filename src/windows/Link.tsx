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
import {applyFocusableComponentMixin} from '../native-desktop/utils/FocusManager';

import {Link as LinkCommon } from '../native-common/Link';

export class Link extends LinkCommon {

    // XXX
    private onFocus() {
        // Focus Manager hook
    }
}

//applyFocusableComponentMixin(Link);

export default Link;
