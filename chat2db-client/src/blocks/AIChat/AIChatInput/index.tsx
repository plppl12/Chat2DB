import React, { useRef, useState } from 'react';
import cs from 'classnames';
import { Input } from 'antd';
import Iconfont from '@/components/Iconfont';
import CascaderDB from '@/components/CascaderDB';
import MyTooltip from '@/components/MyTooltip';
import styles from './index.less';
import { IDBInfo } from '../AIChatConversation';

interface IProps {
  className?: string;
  onSendMessage?: (question: string, dialogContent: IDBInfo) => void;
  inputStatus: 'chat' | 'loading' | 'streaming';
}

function AiChatInput(props: IProps) {
  const { className } = props;
  const [inputValue, setInputValue] = useState<string>('');
  const databaseInfo = useRef<IDBInfo>({});

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.metaKey) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    console.log('发送消息');
    props.onSendMessage && props.onSendMessage(inputValue, databaseInfo.current);
  };

  return (
    <div className={cs(styles.aiChatInput, className)}>
      <div className={styles.inputTools}>
        <CascaderDB
          onChange={(v) => {
            databaseInfo.current = v;
          }}
        />
      </div>
      <div className={styles.inputContent}>
        <Input.TextArea
          placeholder="书写...."
          bordered={false}
          maxLength={4090}
          autoSize={{
            minRows: 1,
            maxRows: 4,
          }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <MyTooltip title="Cmd+Enter">
          <Iconfont onClick={handleSendMessage} code="&#x100bd;" className={styles.sendBtn} />
        </MyTooltip>
      </div>
    </div>
  );
}

export default AiChatInput;
