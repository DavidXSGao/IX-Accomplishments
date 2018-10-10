/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import { CustomAccomplishmentsModal } from './../Modal/customAccomplishmentsModal.js'

export class Card extends Component{
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.state = {
          show: false
        };
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleHide() {
        this.setState({ show: false });
    }
    render(){
        return (
            <div className={"card"+(this.props.plain ? " card-plain":"")}>
                <CustomAccomplishmentsModal
                    category={this.props.category}
                    handleHide={this.handleHide}
                    show={this.state.show}
                />
                <div className={"header"
                    + (this.props.hCenter ? " text-center":"")}>
                    <h4 className="title">{this.props.title}</h4>
                    <p className="category">{this.props.category}</p>
                </div>
                <div className={"content"
                    + (this.props.ctAllIcons ? " all-icons":"")
                    + (this.props.ctTableFullWidth ? " table-full-width":"")
                    + (this.props.ctTableResponsive ? " table-responsive":"")
                    + (this.props.ctTableUpgrade ? " table-upgrade":"")}>

                    {this.props.content}

                    <div className="footer">
                        {this.props.legend}
                        {this.props.stats != null ? <hr />:""}
                        <a className="stats" onClick={this.handleShow}>
                            <i className={this.props.statsicon}></i> {this.props.stats}
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
