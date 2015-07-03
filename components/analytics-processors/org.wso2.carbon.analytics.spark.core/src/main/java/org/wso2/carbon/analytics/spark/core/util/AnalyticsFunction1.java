/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.analytics.spark.core.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.types.StructType;
import org.wso2.carbon.analytics.dataservice.AnalyticsDataService;
import org.wso2.carbon.analytics.dataservice.AnalyticsDataServiceImpl;
import org.wso2.carbon.analytics.datasource.commons.Record;
import org.wso2.carbon.analytics.datasource.commons.exception.AnalyticsException;
import org.wso2.carbon.analytics.spark.core.internal.ServiceHolder;
import scala.collection.Iterator;
import scala.runtime.AbstractFunction1;
import scala.runtime.BoxedUnit;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalyticsFunction1 extends AbstractFunction1<Iterator<Row>, BoxedUnit>
        implements Serializable {

    private static final long serialVersionUID = -1919222653470217466L;
    private static final Log log = LogFactory.getLog(AnalyticsFunction1.class);

    private int tId;
    private String tName;
    private StructType sch;

    public AnalyticsFunction1(int tId, String tName, StructType sch) {
        this.tId = tId;
        this.tName = tName;
        this.sch = sch;
    }

    /**
     * Apply the body of this function to the argument.
     *
     * @param iterator
     * @return the result of function application.
     */
    @Override
    public BoxedUnit apply(Iterator<Row> iterator) {
        List<Record> records = new ArrayList<>();
        AnalyticsDataService ads = ServiceHolder.getAnalyticsDataService();
        if (ads instanceof AnalyticsDataServiceImpl) {
            /* we have to invalidate the table information, since here, if some other node
            changes the table information, we cannot know about it (no cluster communication) */
            ((AnalyticsDataServiceImpl) ads).invalidateAnalyticsTableInfo(this.tId, this.tName);
        }
        while (iterator.hasNext()) {
            if (records.size() == AnalyticsConstants.MAX_RECORDS) {
                try {
                    ads.put(records);
                } catch (AnalyticsException e) {
                    log.error("Error while inserting data into table " + this.tName, e);
                    throw new RuntimeException("Error while inserting data into table " + this.tName, e);
                }
                records.clear();
            } else {
                Row row = iterator.next();
                records.add(new Record(this.tId, this.tName,
                                       convertRowAndSchemaToValuesMap(row, this.sch)));
            }
        }

        if (!records.isEmpty()) {
            try {
                ads.put(records);
            } catch (AnalyticsException e) {
                log.error("Error while pushing data to the dataservice ", e);
                throw new RuntimeException("Error while pushing data to the dataservice ", e);
            }
        }
        return BoxedUnit.UNIT;
    }

    private Map<String, Object> convertRowAndSchemaToValuesMap(Row row, StructType schema) {
        String[] colNames = schema.fieldNames();
        Map<String, Object> result = new HashMap<>();
        for (int i = 0; i < row.length(); i++) {
            result.put(colNames[i], row.get(i));
        }
        return result;
    }

}
