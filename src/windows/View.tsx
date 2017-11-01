import React = require('react');
import RN = require('react-native');

import {View as ViewCommon} from '../native-common/View';
import Button from './Button';

export class View extends ViewCommon {

    protected renderButton(internalProps: any) : JSX.Element {

        // Assume a tabIndex of -1 if not specified
        if (internalProps.tabIndex === undefined) {
            internalProps.tabIndex = -1;
        }

        return (
                <Button { ...internalProps }>
                    { this.props.children }
                </Button>
            );
    }
}

export default View;
