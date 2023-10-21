import React from 'react';
import cs from 'classnames';
import styles from './index.less';
import { Input } from 'antd';

interface IProps {
  className?: string;
}

function AiChatInput(props: IProps) {
  const { className } = props;
  return (
    <div className={cs(styles.aiChatInput, className)}>
      <Input bordered={false} maxLength={4090}/>
    </div>
  );
}

export default AiChatInput;
