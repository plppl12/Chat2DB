import { useWorkspaceStore } from './index';
import { IConsole, ICreateConsoleParams } from '@/typings';
import { IWorkspaceTab } from '@/typings/workspace';
import historyService from '@/service/history';
import { ConsoleStatus, WorkspaceTabType } from '@/constants';

export interface IConsoleStore {
  consoleList: IConsole[] | null;
  activeConsoleId: string | number | null;
  workspaceTabList: IWorkspaceTab[] | null;
  createConsoleLoading: boolean
}

export const initConsoleStore = {
  consoleList: null,
  activeConsoleId: null,
  workspaceTabList: null,
  createConsoleLoading: false
};

export const getSavedConsoleList = () => {
  historyService
    .getSavedConsoleList({
      tabOpened: 'y',
      pageNo: 1,
      pageSize: 20,
    })
    .then((res) => {
      useWorkspaceStore.setState({ consoleList: res?.data });
    });
};

export const setActiveConsoleId = (id: IConsoleStore['activeConsoleId']) => {
  useWorkspaceStore.setState({ activeConsoleId: id });
};

export const setWorkspaceTabList = (items: IConsoleStore['workspaceTabList']) => {
  useWorkspaceStore.setState({ workspaceTabList: items });
};

export const createConsole = (params: ICreateConsoleParams) => {
  const workspaceTabList = useWorkspaceStore.getState().workspaceTabList;
  const newConsole = {
    ...params,
    name: params.name || 'new console',
    ddl: params.ddl || '',
    status: ConsoleStatus.DRAFT,
    operationType: WorkspaceTabType.CONSOLE,
    type: params.databaseType,
  };

  return new Promise((resolve) => {
    if ((workspaceTabList?.length || 0) > 20) {
      return;
    }
    useWorkspaceStore.setState({ createConsoleLoading: true });
    historyService.createConsole(newConsole).then((res) => {
      // 找到活跃的id的位置
      // const activeIndex = workspaceTabList?.findIndex(
      //   (item) => item?.id === useWorkspaceStore.getState().activeConsoleId,
      // );
      // // 向活跃的位置后插入数据
      // if (activeIndex !== -1) {
      //   workspaceTabList?.splice(activeIndex + 1, 0, {
      //     id: res,
      //     title: newConsole.name,
      //     type: newConsole.operationType,
      //     uniqueData: newConsole,
      //   });
      // }

      const newList = [
        ...(workspaceTabList || []),
        {
          id: res,
          title: newConsole.name,
          type: newConsole.operationType,
          uniqueData: newConsole,
        },
      ];

      setWorkspaceTabList(newList);
      setActiveConsoleId(res);
      resolve(res);
    })
      .finally(() => { 
      useWorkspaceStore.setState({ createConsoleLoading: false });
    });
  });
};

export const addWorkspaceTab = (params: IWorkspaceTab) => {
  const workspaceTabList = useWorkspaceStore.getState().workspaceTabList;
  if (workspaceTabList?.findIndex((item) => item?.id === params?.id) !== -1) {
    setActiveConsoleId(params.id);
    return;
  }

  const newList = [...(workspaceTabList || []), params];

  setWorkspaceTabList(newList);
  setActiveConsoleId(params.id);
};
