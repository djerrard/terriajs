'use strict';

// proptypes are in mixin
/* eslint react/prop-types:0*/

import React from 'react';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import Icon from "../../Icon.jsx";
import InnerPanel from './InnerPanel';
import BaseOuterPanel from './BaseOuterPanel';

import Styles from './panel.scss';

import defined from 'terriajs-cesium/Source/Core/defined';

const DropdownPanel = createReactClass({
    displayName: 'DropdownPanel',
    mixins: [BaseOuterPanel],

    onInnerMounted(innerElement) {
        if (innerElement) {
            // how much further right the panel is from the button
            const offset = this.buttonElement.offsetLeft - innerElement.offsetLeft;
            // if the panel is left of the button leave its offset as is, otherwise move it right so it's level with the button.
            const dropdownOffset = offset < innerElement.offsetLeft ? offset : innerElement.offsetLeft;
            // offset the caret to line up with the middle of the button - note that the caret offset is relative to the panel, whereas
            // the offsets for the button/panel are relative to their container.
            const caretOffset = Math.max((this.buttonElement.clientWidth / 2 - 10) - (dropdownOffset - this.buttonElement.offsetLeft), 0);

            this.setState({
                caretOffset: caretOffset >= 0 && (caretOffset + 'px'),
                dropdownOffset: dropdownOffset + 'px'
            });
        } else {
            this.setState({
                caretOffset: undefined,
                dropdownOffset: undefined
            });
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.forceClosed) {
            this.onDismissed();
        }
    },

    render() {
        let iconGlyph;
        if (defined(Icon.GLYPHS[this.props.theme.icon])) {
            iconGlyph = Icon.GLYPHS[this.props.theme.icon];
        } else {
            iconGlyph = this.props.theme.icon;
        }

        return (
            <div className={classNames(Styles.panel, this.props.theme.outer)}>
                <button onClick={this.openPanel}
                        type='button'
                        className={classNames(Styles.button, this.props.theme.btn)}
                        title={this.props.btnTitle}
                        ref={element => this.buttonElement = element}>
                    <If condition={this.props.theme.icon}>
                        <Icon glyph={iconGlyph}/>
                    </If>
                    <span>{this.props.btnText}</span>
                </button>
                <If condition={this.state.isOpen}>
                    <InnerPanel
                        onDismissed={this.onDismissed}
                        innerRef={this.onInnerMounted}
                        doNotCloseFlag={this.getDoNotCloseFlag()}
                        theme={this.props.theme}
                        caretOffset={this.state.caretOffset}
                        dropdownOffset={this.state.dropdownOffset}>
                        {this.props.children}
                    </InnerPanel>
                </If>
            </div>
        );
    },
});

export default DropdownPanel;
