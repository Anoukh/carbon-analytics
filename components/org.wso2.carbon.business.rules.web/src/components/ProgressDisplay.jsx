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
import { CircularProgress } from 'material-ui/Progress';
import { Typography } from 'material-ui';
import Paper from 'material-ui/Paper';
// CSS
import '../index.css';

/**
 * Styles related to this component
 */
const styles = {
    progress: {
        color: '#EF6C00',
    },
    paper: {
        maxWidth: 400,
        paddingTop: 30,
        paddingBottom: 30
    },
};

/**
 * Represents circular progress
 */
class ProgressDisplay extends React.Component {
    render() {
        return (
            <div>
                <Paper style={styles.paper}>
                    <CircularProgress size={50}/>
                    <Typography type="subheading">
                        Please wait
                    </Typography>
                </Paper>
            </div>
        );
    }
}

export default ProgressDisplay;