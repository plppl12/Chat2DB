import React, { useEffect } from 'react';
import styles from './index.less';
import { IConversationItem } from '@/typings/aiConversation';
import AiChatInput from '../AIChatInput';

interface IProps {
  curItem: IConversationItem;
}

function AIChatConversation(props: IProps) {
  const { curItem } = props;
  useEffect(() => {
    if (curItem) {
      console.log('curItem', curItem);
    }
  }, [curItem]);
  return (
    <div className={styles.aiChatConversation}>
      <AiChatInput className={styles.aiInput} />
    </div>
  );
}

export default AIChatConversation;
