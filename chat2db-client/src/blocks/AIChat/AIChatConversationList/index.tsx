import React, { useEffect, useState } from 'react';
import { IConversationItem } from '@/typings/aiConversation';
import Iconfont from '@/components/Iconfont';
import { Button } from 'antd';
import cs from 'classnames';
import styles from './index.less';

interface IProps {
  curConversationId?: number;
  onClickItem: (conversationId: number) => void;
  onClickAddItem: () => void;
}

function AIChatConversationList(props: IProps) {
  const [conversationList, setConversationList] = useState<IConversationItem[]>([]);

  useEffect(() => {
    loadConversationList();
  }, []);

  const loadConversationList = () => {
    const res = [
      {
        id: 1,
        title: '测试数据库1',
      },
      {
        id: 2,
        title: '测试数据库2',
      },
    ];
    // Promise.resolve().then(() => {
    // });
    console.log('load');
    setConversationList(res);
    props.onClickItem && props.onClickItem(res[0].id);
  };

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
          <AIChatConversationItem
            onClick={() => {
              props.onClickItem && props.onClickItem(item.id);
              console.log('onclick');
            }}
            isActive={item.id === props.curConversationId}
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default AIChatConversationList;

function AIChatConversationItem(
  props: IConversationItem & {
    onClick: () => void;
  },
) {
  return (
    <div
      className={cs(styles.flowItem, { [styles.flowItemActive]: props.isActive })}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    >
      <Iconfont code="&#xe657;" className={styles.flowItemIcon} />
      {props.title}
    </div>
  );
}
