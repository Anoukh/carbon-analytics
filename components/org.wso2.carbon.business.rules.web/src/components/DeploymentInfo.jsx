/*
 *  Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

import React from 'react';
// Material UI Components
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, {CardContent} from 'material-ui/Card';
import Dialog, {DialogContent, DialogTitle} from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import DoneIcon from 'material-ui-icons/Done';
import RemoveIcon from 'material-ui-icons/Remove';
import PriorityHighIcon from 'material-ui-icons/PriorityHigh';
import Tooltip from 'material-ui/Tooltip';
// App Constants
import BusinessRulesConstants from '../constants/BusinessRulesConstants';
// CSS
import '../index.css';
import BusinessRulesUtilityFunctions from "../utils/BusinessRulesUtilityFunctions";

/**
 * Styles related to this component
 */
const styles = {
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    card: {
        minWidth: 300,
        maxWidth: 360,
        margin: 15
    },
    chip: {
        margin: 10
    },
    deployedAvatar: {
        color: '#FFF',
        backgroundColor: '#4CAF50'
    },
    notDeployedAvatar: {
        color: '#FFF',
        backgroundColor: '#795548'
    },
    unreachableAvatar: {
        color: '#FFF',
        backgroundColor: '#F44336'
    },
    spacing: '0'
};

/**
 * Displays deployment information of a business rule
 */
class DeploymentInfo extends React.Component {
    /**
     * Renders a node with URL and deployment status
     * @param nodeURL
     * @param status
     */
    static displayNode(nodeURL, status) {
        let statusIcon;
        let avatarStyle;
        switch (status) {
            case 1:
                statusIcon = <DoneIcon/>;
                avatarStyle = styles.deployedAvatar;
                break;
            case 0:
                statusIcon = <RemoveIcon/>;
                avatarStyle = styles.notDeployedAvatar;
                break;
            default:
                statusIcon = <PriorityHighIcon/>;
                avatarStyle = styles.unreachableAvatar;
        }
        return (
            <Tooltip
                id="tooltip-bottom"
                title={BusinessRulesConstants.SIDDHI_APP_DEPLOYMENT_STATUSES[status + 1]}
                placement="bottom">
                <Chip
                    avatar={
                        <Avatar style={avatarStyle}>
                            {statusIcon}
                        </Avatar>
                    }
                    label={nodeURL}
                    style={styles.chip}
                />
            </Tooltip>);
    }

    render() {
        return (
            <Dialog open={this.props.open} onRequestClose={() => this.props.onRequestClose()}>
                {!BusinessRulesUtilityFunctions.isEmpty(this.props.businessRule) ?
                    (<div>
                        <DialogTitle>
                            Deployment Information
                            <Typography type="body2">
                                {`${this.props.businessRule[0].name} ` +
                                `(${BusinessRulesConstants.BUSINESS_RULE_STATUSES[this.props.businessRule[1]]})`}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container style={styles.root}>
                                <Grid item xs={12}>
                                    <Grid container justify="center" spacing={Number(styles.spacing)}>
                                        {this.props.info.map((node) =>
                                            (<Grid item key={node.nodeURL}>
                                                <Card style={styles.card}>
                                                    <CardContent>
                                                        <Typography type="subheading">
                                                            {node.nodeURL}
                                                        </Typography>
                                                        <br/>
                                                        <div style={styles.root}>
                                                            {Object.keys(node.siddhiAppStatuses).map((siddhiAppName) =>
                                                                (DeploymentInfo.displayNode(siddhiAppName,
                                                                    node.siddhiAppStatuses[siddhiAppName])))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </div>) : (null)}
            </Dialog>);
    }
}

export default DeploymentInfo;
