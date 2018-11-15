import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Rate,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ManagementView.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ evaluationTable, evaluationOther, loading }) => ({
  evaluationTable,
  evaluationOther,
  loading: loading.models.evaluationTable,
}))
@Form.create()
class EvaluationManagement extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    evalNumOrder: 2,
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '事项名称',
      dataIndex: 'matterName',
    },
    {
      title: '事项所属区域',
      dataIndex: 'areaName',
    },
    {
      title: '评价人次',
      dataIndex: 'evaluationNumber',
      sorter: true,
      needTotal: true,
    },
    {
      title: '评价来源',
      dataIndex: 'sourceList',
    },
    {
      title: '评价星级',
      width: 200,
      render: (record) => (
        <div title={record.averageScore}>
          <Rate disabled value={Math.ceil(parseFloat(record.averageScore))} />
        </div>
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (record) => (
        <Fragment>
          <Link to={{pathname:'/evaluation-center/evaluation-details',detail:record}}>评价详情</Link>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'evaluationTable/fetch',
      payload: {
        page: 1,
        count: 10,
        matterName: '',
        matterId: '',
        areaName: '',
        sourceId: '',
        score: '',
        evalNumOrder: 0,
      },
    });
    dispatch({
      type: 'evaluationOther/fetch',
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
      page: pagination.current,
      count: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if(sorter.order == 'ascend') {
      params.evalNumOrder = 1;
      this.setState({evalNumOrder: 1});
    }
    else {
      params.evalNumOrder = 2;
      this.setState({evalNumOrder: 2});
    }

    dispatch({
      type: 'evaluationTable/fetch',
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
      type: 'evaluationTable/fetch',
      payload: {
        page: 1,
        count: 10,
        matterName: '',
        matterId: '',
        areaName: '',
        sourceId: '',
        score: '',
        evalNumOrder: this.state.evalNumOrder,
      },
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

      values.evalNumOrder = this.state.evalNumOrder;

      dispatch({
        type: 'evaluationTable/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      evaluationOther: { SourceAndAreaList },
    } = this.props;
    let areaList = [];
    if(SourceAndAreaList != null && Object.keys(SourceAndAreaList).length != 0 && SourceAndAreaList.success) {
      if(SourceAndAreaList.data.areaNameList != null) {
        for(let i = 0, length = SourceAndAreaList.data.areaNameList.length;i < length;i++){
          areaList.push(<Option value={SourceAndAreaList.data.areaNameList[i].key} key={SourceAndAreaList.data.areaNameList[i].key}>{SourceAndAreaList.data.areaNameList[i].value}</Option>)
        }
      }
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="事项名称">
              {getFieldDecorator('matterName')(<Input placeholder="请输入" maxLength="30"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="事项地区">
              {getFieldDecorator('areaName')(
                <Select placeholder="请选择">
                  { areaList }
                </Select>
              )}
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      evaluationOther: { SourceAndAreaList },
    } = this.props;
    let areaList = [], sourceList = [];
    if(SourceAndAreaList != null && Object.keys(SourceAndAreaList).length != 0 && SourceAndAreaList.success) {
      if(SourceAndAreaList.data.areaNameList != null) {
        for(let i = 0, length = SourceAndAreaList.data.areaNameList.length;i < length;i++){
          areaList.push(<Option value={SourceAndAreaList.data.areaNameList[i].key} key={SourceAndAreaList.data.areaNameList[i].key}>{SourceAndAreaList.data.areaNameList[i].value}</Option>)
        }
      }
      if(SourceAndAreaList.data.sourceList != null) {
        for(let i = 0, length = SourceAndAreaList.data.sourceList.length;i < length;i++){
          sourceList.push(<Option value={SourceAndAreaList.data.sourceList[i].key} key={SourceAndAreaList.data.sourceList[i].key}>{SourceAndAreaList.data.sourceList[i].value}</Option>)
        }
      }
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="事项名称">
              {getFieldDecorator('matterName')(<Input placeholder="请输入" maxLength="30"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="事项地区">
              {getFieldDecorator('areaName')(
                <Select placeholder="请选择">
                  { areaList }
                </Select>
              )}
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="事项 I D">
              {getFieldDecorator('matterId')(<Input placeholder="请输入" maxLength="10"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评价来源">
              {getFieldDecorator('sourceId')(
                <Select placeholder="请选择">
                  { sourceList }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评价星级">
              {getFieldDecorator('score')(
                <Select placeholder="请选择">
                  <Option value="1">0-1</Option>
                  <Option value="2">1-2</Option>
                  <Option value="3">2-3</Option>
                  <Option value="4">3-4</Option>
                  <Option value="5">4-5</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      evaluationTable: { evaluationTable },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper title="事项评价管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={evaluationTable}
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

export default EvaluationManagement;
