/**
* ScrollView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop-specific implementation of the cross-platform ScrollView abstraction.
*/

import React = require('react');
import RN = require('react-native');
import RNW = require('react-native-windows');
import {ScrollView as ScrollViewBase} from '../native-common/ScrollView';

import EventHelpers from '../native-desktop/utils/EventHelpers';

RNW.ScrollView = RN.ScrollView;

export class ScrollView extends ScrollViewBase {

    render() {
        let scrollThrottle = this.props.scrollEventThrottle || 16;

        if (scrollThrottle === 0) {
            // Fire at 60fps
            scrollThrottle = 16;
        }

        var layoutCallback = this.props.onLayout ?
                // We have a callback function, call the wrapper
                this._onLayout :
                null;

        var scrollCallback = this.props.onScroll ?
                // We have a callback function, call the wrapper
                this._onScroll :
                null;

        var onKeyDownCallback = this.props.onKeyPress ?
                // We have a callback function, call the wrapper
                this._onKeyDown :
                null;

        // TODO: #737970 Remove special case for UWP when this bug is fixed. The bug
        //   causes you to have to click twice instead of once on some pieces of UI in
        //   order for the UI to acknowledge your interaction.
        const keyboardShouldPersistTaps = 'always'; // this.props.keyboardShouldPersistTaps ? 'always' : 'never'

        // NOTE: We are setting `automaticallyAdjustContentInsets` to false
        // (http://facebook.github.io/react-native/docs/scrollview.html#automaticallyadjustcontentinsets). The
        // 'automaticallyAdjustContentInsets' property is designed to offset the ScrollView's content to account for the
        // navigation and tab bars in iOS. Although RX Navigator is using NavigatorIOS, it hides the navigation bar
        // (navigationBarHidden={true}). We believe that React Native may not be calculating the content insets for the
        // ScrollView correctly in this situation. Disabling this calculation seems to fix the ScrollView inset issues.
        // Currently RX does not expose any components that would require `automaticallyAdjustContentInsets` to be
        // set to true.
        // We also set removeClippedSubviews to false, overriding the default value. Most of the scroll views
        // we use are virtualized anyway.
        return (
            <RNW.ScrollView
                ref={this._setNativeView}
                style={ this.props.style }
                onScroll={ scrollCallback }
                automaticallyAdjustContentInsets={ false }
                showsHorizontalScrollIndicator={ this.props.showsHorizontalScrollIndicator }
                showsVerticalScrollIndicator={ this.props.showsVerticalScrollIndicator }
                keyboardDismissMode={  this.props.keyboardDismissMode }
                keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
                scrollEnabled={ this.props.scrollEnabled }
                onContentSizeChange={ this.props.onContentSizeChange }
                onLayout={ layoutCallback }
                scrollEventThrottle={ scrollThrottle }
                horizontal={ this.props.horizontal }
                bounces={ this.props.bounces }
                pagingEnabled={ this.props.pagingEnabled }
                snapToInterval={ this.props.snapToInterval }
                onMoveShouldSetResponder={ this.props.onMoveShouldSetResponder }
                scrollsToTop={ this.props.scrollsToTop }
                removeClippedSubviews={ false }
                overScrollMode={ this.props.overScrollMode }
                scrollIndicatorInsets={ this.props.scrollIndicatorInsets }
                onScrollBeginDrag={ this.props.onScrollBeginDrag }
                onScrollEndDrag={ this.props.onScrollEndDrag }
                onKeyDown={ onKeyDownCallback }
                tabNavigation={ this.props.tabNavigation }
                disableKeyboardBasedScrolling={true}
            >
                { this.props.children }
            </RNW.ScrollView>
        );
    }

    private _onKeyDown = (e: React.SyntheticEvent) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }
}

export default ScrollView;
