import React = require('react');
import RN = require('react-native');

import {View as ViewCommon} from '../native-common/View';
import Button from './Button';

export class View extends ViewCommon {

    protected renderButton(internalProps: any) : JSX.Element {
        return (
                <Button { ...internalProps }>
                    { this.props.children }
                </Button>
            );
    }
}

export default View;
