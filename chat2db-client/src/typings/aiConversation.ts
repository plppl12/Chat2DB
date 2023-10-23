export enum IPromptType {
  NL_2_SQL = 'NL_2_SQL',
  SQL_EXPLAIN = 'SQL_EXPLAIN',
  SQL_OPTIMIZER = 'SQL_OPTIMIZER',
  SQL_2_SQL = 'SQL_2_SQL',
  // ChatRobot = 'ChatRobot',
}

export interface IConversationItem {
  id?: number;
  title: string;
  isActive?: boolean;
  // 自动、手动同步表结构
  syncTableStructure?: boolean;
}
