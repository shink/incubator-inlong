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

package org.apache.inlong.sdk.dataproxy.network;

import org.apache.inlong.sdk.dataproxy.codec.EncodeObject;
import org.apache.inlong.sdk.dataproxy.common.SendResult;
import org.apache.inlong.sdk.dataproxy.utils.LogCounter;

import io.netty.channel.ChannelFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class SyncMessageCallable implements Callable<SendResult> {

    private static final Logger logger = LoggerFactory.getLogger(SyncMessageCallable.class);
    private static final LogCounter exptCnt = new LogCounter(10, 100000, 60 * 1000L);

    private final NettyClient client;
    private final CountDownLatch awaitLatch = new CountDownLatch(1);
    private final EncodeObject encodeObject;
    private final long timeoutMs;

    private SendResult message;

    public SyncMessageCallable(NettyClient client, EncodeObject encodeObject, long timeoutMs) {
        this.client = client;
        this.encodeObject = encodeObject;
        this.timeoutMs = timeoutMs;
    }

    public void update(SendResult message) {
        this.message = message;
        awaitLatch.countDown();
    }

    public SendResult call() throws Exception {
        try {
            if (!client.getChannel().isWritable()) {
                return SendResult.WRITE_OVER_WATERMARK;
            }
            ChannelFuture channelFuture = client.write(encodeObject);
            awaitLatch.await(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (Throwable ex) {
            if (exptCnt.shouldPrint()) {
                logger.warn("SyncMessageCallable write data throw exception", ex);
            }
            return SendResult.UNKOWN_ERROR;
        }
        return message;
    }

    public NettyClient getClient() {
        return client;
    }
}