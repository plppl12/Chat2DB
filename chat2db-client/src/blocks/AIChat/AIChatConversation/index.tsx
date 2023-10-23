import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { IConversationItem, IPromptType } from '@/typings/aiConversation';
import AiChatInput, { IDialogContent } from '../AIChatInput';
import { IAIState } from '@/models/ai';
import { formatParams } from '@/utils/common';
import connectToEventSource from '@/utils/eventSource';
import { v4 as uuidv4 } from 'uuid';
export interface IDBInfo {
  dataSourceId: number;
  databaseName: string;
  schemaName: string;
}
export interface IDialogContent {
  dataSourceId: number;
  databaseName: string;
  schemaName: string;
  question: string;
  answer: string;
  promptType: IPromptType;
}

interface IProps {
  curItem: IConversationItem;
  aiModel: IAIState;
}

function AIChatConversation(props: IProps) {
  const { curItem } = props;
  const [dialogContentList, setDialogContentList] = useState<IDialogContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const closeEventSource = useRef<any>();
  const curAnswer = useRef<string>('');

  useEffect(() => {
    if (curItem) {
      console.log('curItem', curItem);
    }
  }, [curItem]);

  const handleAiChat = (question: string, dbInfo: IDBInfo, promptType: IPromptType, ext?: string) => {
    // const { apiKey } = aiModel;

    const curConversation = {
      ...dbInfo,
      question,
      answer: '',
      promptType,
    };
    dialogContentList.push(curConversation);

    const params = formatParams({
      message: question,
      promptType,
      ...dbInfo,
      // tableNames: syncTableModel ? selectedTables : null,
      ext,
    });

    const handleMessage = (message: string) => {
      setIsLoading(false);
      try {
        const isEOF = message === '[DONE]';
        if (isEOF) {
          // 关闭SSE
          closeEventSource.current();
          setIsStreaming(false);
        }
        const { length } = dialogContentList;
        const lastItem = dialogContentList[length - 1];
        curAnswer.current += JSON.parse(message).content;
        lastItem.answer = curAnswer.current;
        setDialogContentList([...dialogContentList]);
      } catch (e) {
        setIsLoading(false);
        setIsStreaming(false);
        closeEventSource.current();
      }
    };

    const handleError = (error: any) => {
      console.error('Error:', error);
      setIsLoading(false);
      closeEventSource.current();
    };

    closeEventSource.current = connectToEventSource({
      url: `/api/ai/chat?${params}`,
      uid: uuidv4(),
      onMessage: handleMessage,
      onError: handleError,
      onOpen: () => {
        setIsStreaming(true);
      },
    });
  };
  return (
    <div className={styles.aiChatConversation}>
      {(dialogContentList || []).map((item: IDialogContent, index) => {
        return (
          <div key={index} style={{ marginBottom: '20px' }}>
            <div>
              {item.dataSourceId}/{item.databaseName}/{item.schemaName}
            </div>
            <div>{item.question}</div>
            <div>{item.answer}</div>
          </div>
        );
      })}
      <AiChatInput
        className={styles.aiInput}
        inputStatus={'chat'}
        onSendMessage={(question, dbInfo) => {
          handleAiChat(question, dbInfo, IPromptType.NL_2_SQL);
        }}
      />
    </div>
  );
}

export default AIChatConversation;
