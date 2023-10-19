import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatabaseTypeCode } from '@/constants';
import Iconfont from '@/components/Iconfont';

interface IConversationItem {
  id?: number;
  title: string;
  type?: DatabaseTypeCode;
  dataSourceId?: number;
  schemaName?: string;
  databaseName?: string;
  // 自动、手动同步表结构
  syncTableStructure?: boolean;
}

function AIChatConversationList() {
  const [conversationList, setConversationList] = useState<IConversationItem[]>([]);

  useEffect(() => {
    setConversationList([
      {
        id: 1,
        title: '测试数据库1',
        type: DatabaseTypeCode.MYSQL,
        dataSourceId: 2,
        databaseName: 'ali_dbhub_test',
      },
      {
        id: 2,
        title: '测试数据库2',
        type: DatabaseTypeCode.MYSQL,
        dataSourceId: 2,
        databaseName: 'sql_hr',
      },
    ]);
  }, []);

  return (
    <div className={styles.aiChatConversationList}>
      <div className={styles.title}>AI聊天列表</div>

      <div className={styles.flow}>
        {(conversationList || [])?.map((item) => (
          <AIChatConversationItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default AIChatConversationList;

function AIChatConversationItem(props: IConversationItem) {
  return (
    <div className={styles.flowItem}>
      <Iconfont code="&#xe657;" className={styles.flowItemIcon} />
      {props.title}
    </div>
  );
}
