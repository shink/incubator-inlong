/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.inlong.agent.plugin.sinks;

import static org.apache.inlong.agent.constants.AgentConstants.AGENT_MESSAGE_FILTER_CLASSNAME;

import org.apache.inlong.agent.conf.JobProfile;
import org.apache.inlong.agent.core.AgentManager;
import org.apache.inlong.agent.plugin.MessageFilter;
import org.apache.inlong.agent.plugin.Sink;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractSink implements Sink {

    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractSink.class);

    @Override
    public MessageFilter initMessageFilter(JobProfile jobConf) {
        if (jobConf.hasKey(AGENT_MESSAGE_FILTER_CLASSNAME)) {
            try {
                return (MessageFilter) Class.forName(jobConf.get(AGENT_MESSAGE_FILTER_CLASSNAME))
                    .getDeclaredConstructor().newInstance();
            } catch (Exception e) {
                LOGGER.error("init message filter error", e);
            }
        }
        return null;
    }

}
