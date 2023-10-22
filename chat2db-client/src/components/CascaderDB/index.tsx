import React, { useEffect, useState } from 'react';
import { Cascader, CascaderProps } from 'antd';
import connection from '@/service/connection';
import { BaseOptionType } from 'antd/es/cascader';
import cs from 'classnames';
import styles from './index.less';
import Iconfont from '../Iconfont';

interface IProps extends CascaderProps<BaseOptionType> {
  className?: string;
}

function CascaderDB(props: IProps) {
  const [cascaderOptions, setCascaderOptions] = useState<BaseOptionType[]>([]);

  useEffect(() => {
    loadDataSource();
  }, []);

  const loadDataSource = async () => {
    // 请求 dataSource 数据
    const data = await connection.getList({
      pageNo: 1,
      pageSize: 999,
      refresh: true,
    });
    const formattedData = (data?.data || []).map((item) => ({
      ...item,
      key: `dataSource-${item.id}`,
      value: item.id,
      label: item.alias,
      isLeaf: false,
      render: (label) => (
        <div>
          <Iconfont code="&#xe61b;" size={12} />
          <span>{label}</span>
        </div>
      ),
    }));
    setCascaderOptions(formattedData);
  };

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.loading = true;

    // 2. 加载 database
    if (selectedOptions.length === 1) {
      const databases = await connection.getDBList({
        dataSourceId: targetOption.value,
        refresh: true,
      });
      targetOption.loading = false;
      targetOption.children = (databases || []).map((db) => ({
        ...db,
        key: `database-${db.name}`,
        value: db.name,
        label: db.name,
        isLeaf: false,
      }));
    }
    // 3. 加载 schema
    else if (selectedOptions.length === 2) {
      const schemas = await connection.getSchemaList({
        dataSourceId: selectedOptions[0].value,
        databaseName: selectedOptions[1].value,
      });
      targetOption.loading = false;
      if (schemas.length > 0) {
        targetOption.children = schemas.map((schema) => ({
          value: schema.name,
          label: schema.name,
          isLeaf: true,
        }));
      } else {
        targetOption.isLeaf = true;
      }
    }

    // 更新状态
    setCascaderOptions([...cascaderOptions]);
  };

  return (
    <Cascader
      {...props}
      className={cs(props.className, styles.cascaderDB)}
      options={cascaderOptions}
      loadData={loadData}
    />
  );
}

export default CascaderDB;
