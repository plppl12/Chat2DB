import React, { useEffect, useRef, useState } from 'react';

import { IPromptType } from '@/typings/aiConversation';
import AiChatInput from '../AIChatInput';
import { IAIState } from '@/models/ai';
import { formatParams } from '@/utils/common';
import connectToEventSource from '@/utils/eventSource';
import { v4 as uuidv4 } from 'uuid';
import { IConnectionDetails } from '@/typings';
import Iconfont from '@/components/Iconfont';
import { databaseMap } from '@/constants';
import styles from './index.less';
import { Popover } from 'antd';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import cs from 'classnames';
import 'highlight.js/styles/github-dark.css'

export interface IDBInfo {
  dataSourceId: number;
  databaseName: string;
  schemaName: string;
}
export interface IDialogContent {
  dataSourceId: number;
  databaseName: string;
  schemaName: string;
  tableName: string[];
  question: string;
  answer: string;
  promptType: IPromptType;
}

interface IProps {
  curConversationId?: number;
  aiModel: IAIState;
  connectionList: IConnectionDetails[];
}

const md = new MarkdownIt({
  linkify: true,
  breaks: true,
  highlight: (str: string, lang: string, attrs: string): string => {
    let content = str;
    if (lang && hljs.getLanguage(lang)) {
      try {
        content = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (e) {
        console.log(e);
        return str;
      }
    } else {
      content = md.utils.escapeHtml(str);
    }

    // join actions html string
    lang = (lang || 'txt').toUpperCase();
    return [
      '<div class="code-block-wrapper">',
      `<div class="code-header"><span class="code-lang">${lang}</span><div class="copy-action">Copy</div></div>`,
      '<pre class="hljs code-block">',
      `<code>${content}</code>`,
      '</pre>',
      '</div>',
    ].join('');
  },
});

// md.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' });
// md.use(mila, { attrs: { target: '_blank', rel: 'noopener' } });

function AIChatConversation(props: IProps) {
  const { curConversationId, connectionList } = props;
  const [dialogContentList, setDialogContentList] = useState<IDialogContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const closeEventSource = useRef<any>();
  const curAnswer = useRef<string>('');

  useEffect(() => {
    if (curConversationId) {
      // console.log('curItem', curConversationId);
      // TODO: 请求当前会话数据
      setDialogContentList([
        {
          dataSourceId: 2,
          databaseName: 'test',
          schemaName: 'test',
          tableName: ['table1', 'table2', 'table3'],
          question: 'tsasdtsasdftsasdftsasdftsasdftsasdftsasdtsasdftsasdftsasdftsasdftsasdfff',
          answer: `
\`\`\`js
import React, { useState } from 'react';
import { Modal } from 'antd'; // 假设你正在使用 antd 的 Modal
import MarkdownRenderer from './MarkdownRenderer';

function MyDialog() {
    const [isVisible, setIsVisible] = useState(true);
    const markdownContent = "## Hello, world!\n\nThis is some *markdown* content.";

    return (
        <Modal
            visible={isVisible}
            onCancel={() => setIsVisible(false)}
            footer={null}
        >
            <MarkdownRenderer markdownText={markdownContent} />
        </Modal>
    );
}

export default MyDialog;


\`\`\`

          `,
          promptType: IPromptType.NL_2_SQL,
        },
      ]);
    }
  }, [curConversationId]);

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

  /** 渲染DB的信息 */
  const renderDBInfo = (dialogContent: IDialogContent) => {
    const dataSource = (connectionList || []).find((v) => v.id === dialogContent.dataSourceId);
    const dataSourceBlock = dataSource ? (
      <div className={styles.DBInfo}>
        <Iconfont className={styles.DBInfoIcon} code={databaseMap[dataSource.type]?.icon} />
        <div className={styles.DBInfoText}>{dataSource.alias}</div>
      </div>
    ) : null;

    const databaseBlock = dialogContent.databaseName ? (
      <div className={styles.DBInfo}>
        <Iconfont className={styles.DBInfoIcon} code="&#xe744;" />
        <div className={styles.DBInfoText}>{dialogContent.databaseName}</div>
      </div>
    ) : null;

    const schemaBlock = dialogContent.schemaName ? (
      <div className={styles.DBInfo}>
        <Iconfont className={styles.DBInfoIcon} code="&#xe696;" />
        <div className={styles.DBInfoText}>{dialogContent.schemaName}</div>
      </div>
    ) : null;

    const tableBlock = dialogContent.tableName?.length ? (
      <Popover content={`上传到AI的表${(dialogContent.tableName || []).join(',')}`} placement="bottom">
        <Iconfont className={styles.DBInfoIcon} style={{ marginLeft: '8px' }} code="&#xe618;" />
      </Popover>
    ) : null;
    return (
      <div className={styles.dbBlock} style={{ display: 'flex', alignItems: 'center' }}>
        {dataSourceBlock}
        {databaseBlock}
        {schemaBlock}
        {tableBlock}
      </div>
    );
  };

  const renderConversationItem = (item: IDialogContent, keyIndex: number) => {
    return (
      <div key={keyIndex} className={styles.conversationItem}>
        {renderDBInfo(item)}
        <div className={styles.conversationQA}>
          <Iconfont className={styles.conversationQAIcon} code="&#xe6a8;" />
          <div className={styles.conversationQAText}>{item.question}</div>
        </div>
        <div className={styles.conversationQA}>
          <Iconfont className={styles.conversationQAIcon} code="&#xe686;" />
          <div
            className={cs(styles.conversationQAText, styles.conversationAnswerText)}
            dangerouslySetInnerHTML={{ __html: md.render(item.answer) }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.aiChatConversation}>
      {(dialogContentList || []).map((item: IDialogContent, index) => renderConversationItem(item, index))}
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
