import React, { useEffect, useRef } from 'react';
import AIChatConversationList from './AIChatConversationList';
import AIChatConversation from './AIChatConversation';
import { connect } from 'umi';
import { IAIModelType, IAIState } from '@/models/ai';
import { IConnectionModelState, IConnectionModelType } from '@/models/connection';
import { message } from 'antd';
import styles from './index.less';

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
  connectionModel: IConnectionModelState;
}

function AIChat(props: IAIChatProps) {
  const [activeConversationId, setActiveConversationId] = React.useState<number>();
  // console.log('props', props);

  const codeBlockCopyEvent = useRef((e: Event) => {
    const target: HTMLElement = e.target as HTMLElement;

    const isCopyActionClassName = target.className === 'copy-action';
    const isCodeBlockParent = target.parentElement?.parentElement?.className === 'code-block-wrapper';

    // check is copy action button
    if (!(isCopyActionClassName && isCodeBlockParent)) {
      return;
    }

    // got codes
    const content = target?.parentNode?.parentNode?.querySelector('code')?.innerText ?? '';

    // do copy
    // * thats lines copy from copy block content action
    navigator.clipboard.writeText(content);
    message.success('复制成功');
    // store.addToast(t('copied to clipboard'));
  });

  // bind code block copy event on mounted
  useEffect(() => {
    document.addEventListener('click', codeBlockCopyEvent.current);

    return () => {
      document.removeEventListener('click', codeBlockCopyEvent.current);
    };
  }, []);

  return (
    <div className={styles.aiChat}>
      <AIChatConversationList
        curConversationId={activeConversationId}
        onClickAddItem={() => {}}
        onClickItem={(conversationId: number) => {
          setActiveConversationId(conversationId);
        }}
      />

      <AIChatConversation
        aiModel={props.aiModel}
        connectionList={props.connectionModel?.connectionList}
        curConversationId={activeConversationId}
      />
    </div>
  );
}

const dvaModel = connect(({ connection, ai }: { connection: IConnectionModelType; ai: IAIModelType }) => ({
  aiModel: ai,
  connectionModel: connection,
}));

export default dvaModel(AIChat);
