import React from 'react';
import styles from './index.less';
import AIChatConversationList from './AIChatConversationList';
import AIChatConversation from './AIChatConversation';

export interface AIChatUsedType {
  /** 页面使用 */
  PAGE: 'page';
  /** 嵌入使用 */
  embed: 'embed';
}

interface IAIChatProps {
  /** 被使用形式 */
  type: AIChatUsedType;
}

function AIChat(props: IAIChatProps) {
  const { type } = props;
  return (
    <div className={styles.aiChat}>
      <AIChatConversationList />

      <AIChatConversation />
    </div>
  );
}

export default AIChat;
