import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Modal,
  Badge,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatDateTime } from '@/utils/utils';

import styles from '../EvaluationManagement/ManagementView.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = [
  {key:'1',icon:'success',text:'评价中'},
  {key:'4',icon:'default',text:'未开启'},
  {key:'8',icon:'error',text:'关闭'},
];
/* eslint react/no-multi-comp:0 */
@connect(({ sourceTable, sourceOther, loading }) => ({
  sourceTable,
  sourceOther,
  loading: loading.models.sourceTable,
}))
@Form.create()
class SourceConfigList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
      width: 60,
    },
    {
      title: '来源名称',
      dataIndex: 'sourceName',
    },
    {
      title: '评价模板',
      dataIndex: 'templateName',
      width: 100,
    },
    {
      title: '来源标识',
      dataIndex: 'idCode',
    },
    {
      title: '密钥',
      dataIndex: 'privateKey',
    },
    {
      title: '评价状态',
      dataIndex: 'state',
      width: 100,
      render: (val) => {
        for(let i=0;i<statusMap.length;i++){
          if(val == statusMap[i].key) {
            return <Badge status={statusMap[i].icon} text={statusMap[i].text} />
          }
        }
      },
    },
    {
      title: '最新操作时间',
      width: 130,
      render: (record) => (
        formatDateTime(record.gmtModify)
      ),
    },
    {
      title: '操作',
      width: 180,
      render: (record) => {
        if(record.state == 1) {
          return <Fragment>
                  <a onClick={() => this.handleUpdate(record, 8)}>关闭</a>
                  <Divider type="vertical" />
                  <Link to={{pathname:'/evaluation-center/source-config-edit',sourceMsg:record}}>查看</Link>
                </Fragment>
        }
        else {
          return  <Fragment>
                    <a onClick={() => this.handleUpdate(record, 1)}>开启</a>
                    <Divider type="vertical" />
                    <Link to={{pathname:'/evaluation-center/source-config-edit',sourceMsg:record}}>编辑</Link>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleUpdate(record, 2)}>删除</a>
                  </Fragment>
        }
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceTable/fetch',
      payload: {
        page: 1,
        count: 10,
        name: '',
      },
    });
  }

  handleUpdate = (record, state) => {
    const { dispatch } = this.props;
    const params = {
      sourceId: record.sourceId,
      state: state,
    }
    let alertMessage = '';
    switch (state) {
      case 1:
      alertMessage = '开启';
        break;
      case 2:
      alertMessage = '删除';
        break;
      default:
        break;
    }
    confirm({
      title: '是否'+alertMessage+'该选项?',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'sourceOther/update',
          payload: params,
          callback: () =>{
            message.success('操作成功');
            dispatch({
              type: 'sourceTable/fetch',
              payload: params,
            });
          }
        });
      },
      onCancel() {},
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      count: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sourceTable/fetch',
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
      type: 'sourceTable/fetch',
      payload: {
        page: 1,
        count: 10,
        name: '',
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sourceTable/fetch',
        payload: values,
      });
    });
  };

  handleAddSource = () => {
    router.push('/evaluation-center/source-config-add');
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="来源名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" maxLength="30"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      sourceTable: { sourceTable },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="来源配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddSource()}>
                新增
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              data={sourceTable}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SourceConfigList;
