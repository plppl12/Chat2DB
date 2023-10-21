export interface IConversationItem {
  id?: number;
  title: string;
  isActive?: boolean;
  // 自动、手动同步表结构
  syncTableStructure?: boolean;
}
