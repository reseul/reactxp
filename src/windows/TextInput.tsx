/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop-specific implementation of the cross-platform TextInput abstraction.
*/

import React = require('react');
import RN = require('react-native');
import Types = require('../common/Types');

import {applyFocusableComponentMixin} from '../native-desktop/utils/FocusManager';

import {TextInput} from '../native-common/TextInput';

//applyFocusableComponentMixin(TextInput);

export {TextInput};
export default TextInput;
