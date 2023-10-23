import React from 'react';
import styles from './index.less';
import AIChatConversationList, { IConversationItem } from './AIChatConversationList';
import AIChatConversation from './AIChatConversation';
import { connect } from 'umi';
import { IAIState } from '@/models/ai';

export interface AIChatUsedType {
  /** 页面使用 */
  PAGE: 'page';
  /** 嵌入使用 */
  embed: 'embed';
}

interface IAIChatProps {
  /** 被使用形式 */
  type: AIChatUsedType;

  aiModel: IAIState;
}

function AIChat(props: IAIChatProps) {
  const { type, aiModel } = props;

  const [activeConversation, setActiveConversation] = React.useState<IConversationItem | null>(null);

  return (
    <div className={styles.aiChat}>
      <AIChatConversationList
        onClickItem={(item: IConversationItem) => {
          setActiveConversation(item);
        }}
        onClickAddItem={() => {}}
      />

      <AIChatConversation aiModel={props.aiModel} curItem={activeConversation} />
    </div>
  );
}

const dvaModel = connect(({ ai }: { ai: IAIState }) => ({
  aiModal: ai,
}));

export default dvaModel(AIChat);
