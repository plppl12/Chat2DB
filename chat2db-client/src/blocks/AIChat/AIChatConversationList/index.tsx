import React, { useEffect, useState } from 'react';
import { IConversationItem } from '@/typings/aiConversation';
import Iconfont from '@/components/Iconfont';
import { Button } from 'antd';
import styles from './index.less';

interface IProps {
  onClickItem: (item: IConversationItem) => void;
  onClickAddItem: () => void;
}

function AIChatConversationList(props: IProps) {
  const [conversationList, setConversationList] = useState<IConversationItem[]>([]);

  useEffect(() => {
    setConversationList([
      {
        id: 1,
        title: '测试数据库1',
      },
      {
        id: 2,
        title: '测试数据库2',
      },
    ]);
  }, []);

  return (
    <div className={styles.aiChatConversationList}>
      <div className={styles.title}>
        历史记录
        <Button
          type="primary"
          size="middle"
          style={{ padding: '3px 8px' }}
          onClick={() => {
            props.onClickAddItem && props.onClickAddItem();
          }}
        >
          <Iconfont code="&#xe61b;" size={12} />
        </Button>
      </div>

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
