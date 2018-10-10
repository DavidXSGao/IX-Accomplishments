/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import {Card} from './../Card/card.js';
import {RecentAccomplishments} from './recentAccomplishments.js';
import {MostRecognitions} from './mostRecognitions.js';
import {Collapsible} from './../Collapsible/collapsible.js';

function mapStateToProps(store) {
  return {
    user: store.user.user,
  }
}

class Dashboard extends Component {
  render() {
    return (
    	<div className="content">
        <Grid fluid>
          <Row>
            <Col md={10} style={{overflow: 'hidden'}}>
              <Row>
              <Collapsible
                handleFailNotification={this.props.handleFailNotification}
                handleSuccessNotification={this.props.handleSuccessNotification}
                user={this.props.user}
                dispatch={this.props.dispatch}
                history={this.props.history}
              />
              </Row>
              <Row className="not-sticky-83" >
                <Card
                  title="Accomplishments"
                  category="Most Recent Accomplishments"
                  stats="View All"
                  statsicon="fa fa-angle-double-right"
                  content={
                    <div className="table-full-width">
                      <table className="table">
                        <RecentAccomplishments
                        user={this.props.user}
                        dispatch={this.props.dispatch}
                        history={this.props.history}
                        />
                      </table>
                    </div>
                  }
                />
              </Row>
            </Col>
            <Col md={2} className="leaderboards">
              <Row md={6}>
                <Card
                  title="Recognized"
                  category="Most Received Recognitions"
                  stats="View All"
                  statsicon="fa fa-angle-double-right"
                  content={
                    <div className="table-full-width">
                      <table className="table">
                        <MostRecognitions call="mostrecognized"
                        dispatch={this.props.dispatch}
                        history={this.props.history}
                        />
                      </table>
                    </div>
                  }
                />
              </Row>
              <Row md={6}>
                <Card
                  title="Given Recogitions"
                  category="Most Given Recognitions"
                  stats="View All"
                  statsicon="fa fa-angle-double-right"
                  content={
                    <div className="table-full-width">
                        <table className="table">
                          <MostRecognitions call="mostrecognitions"
                          dispatch={this.props.dispatch}
                          history={this.props.history}
                          />
                        </table>
                    </div>
                  }
                />
              </Row>
            </Col>
          </Row>
        </Grid>
        <div className="clearfix">
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard));
