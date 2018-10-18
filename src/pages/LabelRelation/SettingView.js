import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Form,
  Select,
  Button,
  Divider,
  Tag,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '../EvaluationManagement/ManagementView.less';

const { Description } = DescriptionList;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class LabelRelationSetting extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '用户ID',
      dataIndex: 'itemName',
    },
    {
      title: '评价标签',
      dataIndex: 'area',
    },
    {
      title: '评价内容',
      dataIndex: 'num',
    },
    {
      title: '评价来源',
      dataIndex: 'source',
    },
    {
      title: '评价时间',
      dataIndex: 'callNo',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  onChange = () => {

  };

  log = (e) =>{
    console.log(e);
  };

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows} = this.state;
    return (
      <PageHeaderWrapper title="事项评价详情">
        <Card bordered={false}>
          <Button type="primary" style={{ float: 'right', marginBottom: 24 }} >提交</Button> 
          <Button type="default" style={{ float: 'right', marginBottom: 24, marginRight: 10 }} onClick={() => {router.push('/labelrelationlist')}}>返回</Button>  
          <DescriptionList size="large" title="评价详情" style={{ marginBottom: 32 }}>
            <Description term="来源名称">事项来源</Description>
          </DescriptionList>
          <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
            <Description term="标签名称">
              <Tag closable onClose={this.log}>Tag 1</Tag>
              <Tag closable onClose={this.log}>Tag 2</Tag>
              <Tag closable onClose={this.log}>Tag 3</Tag>
              <Tag closable onClose={this.log}>Tag 4</Tag>
              <Tag closable onClose={this.log}>Tag 5</Tag>
              <Tag closable onClose={this.log}>Tag 6</Tag>
            </Description>
          </DescriptionList>
          <div>

          </div>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowSelect
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default LabelRelationSetting;