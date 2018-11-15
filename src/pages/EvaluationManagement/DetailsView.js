import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Divider,
  Rate,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import { formatDateTime, formatDateTimeReverse } from '@/utils/utils';

import styles from './ManagementView.less';

const { Description } = DescriptionList;
const { RangePicker } = DatePicker;

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
class EvaluationDetails extends PureComponent {
  state = {
    expandForm: false,
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
      title: '用户ID',
      dataIndex: 'userId',
      width: 150,
    },
    {
      title: '评价标签',
      dataIndex: 'tags',
      width: 400,
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '评价星级',
      width: 200,
      render: (record) => (
        <div title={record.score}>
          <Rate disabled value={Math.ceil(parseFloat(record.score))} />
        </div>
      ),
    },
    {
      title: '评价来源',
      dataIndex: 'source',
      width: 130,
    },
    {
      title: '评价时间',
      width: 120,
      render: (record) => (
        formatDateTime(record.gmtCreate)
      ),
    },
  ];

  componentWillMount() {
    const detail = this.props.location.detail;
    if(detail == undefined){
      router.push('/evaluation-center/evaluation-management')
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const detail = this.props.location.detail;
    if(detail != undefined){
      dispatch({
        type: 'evaluationTable/fetchDetail',
        payload: {
          page: 1,
          count: 10,
          matterId: detail.matterId,
          userId: '',
          tagName: '',
          content: '',
          needMatter: 2,
          score: '',
          sourceId: '',
        }
      });
      dispatch({
        type: 'evaluationOther/fetch',
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const detail = this.props.location.detail;

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

    params.matterId = detail.matterId,

    dispatch({
      type: 'evaluationTable/fetchDetail',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const detail = this.props.location.detail;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'evaluationTable/fetchDetail',
      payload: {
        page: 1,
        count: 10,
        matterId: detail.matterId,
        userId: '',
        tagName: '',
        content: '',
        needMatter: 2,
        score: '',
        sourceId: '',
      }
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
    const detail = this.props.location.detail;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      values.matterId = detail.matterId;

      this.setState({
        formValues: values,
      });

      if(values.time != undefined){
        values.beginDateTime = formatDateTimeReverse(values.time[0], 'begin');
        values.endDateTime = formatDateTimeReverse(values.time[1], 'end');
      }

      dispatch({
        type: 'evaluationTable/fetchDetail',
        payload: values,
      });
    });
  };

  onChange = (date, dateString) => {

  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户 I D">
              {getFieldDecorator('userId')(<Input placeholder="请输入" maxLength="20"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评价时间">
              {getFieldDecorator('time')(<RangePicker onChange={this.onChange} />)}
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
    let sourceList = [];
    if(Object.keys(SourceAndAreaList).length != 0 && SourceAndAreaList.success) {
      for(let i = 0, length = SourceAndAreaList.data.sourceList.length;i < length;i++){
        sourceList.push(<Option value={SourceAndAreaList.data.sourceList[i].key} key={SourceAndAreaList.data.sourceList[i].key}>{SourceAndAreaList.data.sourceList[i].value}</Option>)
      }
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户 I D">
              {getFieldDecorator('userId')(<Input placeholder="请输入" maxLength="20"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评价时间">
              {getFieldDecorator('time')(<RangePicker onChange={this.onChange} />)}
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
            <FormItem label="评价标签">
              {getFieldDecorator('tagName')(<Input placeholder="请输入" maxLength="30"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评价内容">
              {getFieldDecorator('content')(<Input placeholder="请输入" maxLength="200"/>)}
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="评价来源">
              {getFieldDecorator('sourceId')(
                <Select placeholder="请选择">
                  { sourceList }
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
      evaluationTable: { evaluationDetailTable },
      loading,
    } = this.props;
    const { selectedRows} = this.state;
    const detail = this.props.location.detail;
    return (
      <PageHeaderWrapper title="事项评价详情">
        <Card bordered={false}>
          <Button type="primary" style={{ float: 'right', marginBottom: 24 }} onClick={() => {router.push('/evaluation-center/evaluation-management')}}>返回</Button>  
          <DescriptionList size="large" title="评价详情" style={{ marginBottom: 32 }}>
            <Description term="事项名称">{detail != undefined?detail.matterName:''}</Description>
            <Description term="事项所属地区">{detail != undefined?detail.areaName:''}</Description>
            <Description term="事项ID">{detail != undefined?detail.matterId:''}</Description>
            <Description term="事项所属部门">{detail != undefined?detail.orgName:''}</Description>
            <Description term="总评价人次">{detail != undefined?detail.evaluationNumber:''}</Description>
            <Description term="评价星级"><div title={detail != undefined?parseFloat(detail.averageScore):0}><Rate disabled value={detail != undefined?Math.ceil(parseFloat(detail.averageScore)):0} /></div></Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={evaluationDetailTable}
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

export default EvaluationDetails;