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
  message,
  DatePicker,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatDateTime } from '@/utils/utils';

import styles from '../EvaluationManagement/ManagementView.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const roleMap = [
  {key:'0',text:'超级管理员'},
  {key:'1',text:'用户'},
  {key:'2',text:'用户2'},
];
/* eslint react/no-multi-comp:0 */
@connect(({ usertable, userother, loading }) => ({
  usertable,
  userother,
  loading: loading.models.usertable,
}))
@Form.create()
class UserManagement extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '角色名称',
      dataIndex: 'userType',
      render: (val) => {
        for(let i=0;i<roleMap.length;i++){
          if(val == roleMap[i].key) {
            return roleMap[i].text
          }
        }
      },
    },
    {
      title: '添加时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '操作',
      render: (record) => {
        if(record.status == '1') {
          return <Fragment>
                  <Link to={{pathname:'/system-management/user-edit',userInfo:record}}>编辑</Link>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleOpen(record)}>恢复</a>
                </Fragment>
        }
        else if(record.status == '0'){
          return <Fragment>
                  <Link to={{pathname:'/system-management/user-edit',userInfo:record}}>编辑</Link>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleDisable(record)}>禁用</a>
                </Fragment>
        }
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usertable/fetch',
      payload: {
        username: '',
        mobile: '',
        status: '',
        startDate: '',
        endDate: '',
        page: 1,
        size: 10     
      },
    });
  }

  handleDisable = (record) => {
    const { dispatch } = this.props;
    const params = {
      userId: record.id,
    }
    let that = this;
    confirm({
      title: '是否禁用该用户?',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'userother/disable',
          payload: params,
          callback: () =>{
            message.success('操作成功');
            that.handleFormReset();
          }
        });
      },
      onCancel() {},
    });
  };

  handleOpen = (record) => {
    const { dispatch } = this.props;
    const params = {
      userId: record.id,
    }
    let that = this;
    confirm({
      title: '是否启用该用户?',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'userother/open',
          payload: params,
          callback: () =>{
            message.success('操作成功');
            that.handleFormReset();
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
      type: 'usertable/fetch',
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
      type: 'usertable/fetch',
      payload: {
        username: '',
        mobile: '',
        status: '',
        startDate: '',
        endDate: '',
        page: 1,
        size: 10     
      },
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

      if(values.time != undefined){
        values.startDate = formatDateTime(values.time[0]);
        values.endDate = formatDateTime(values.time[1]);
      }

      dispatch({
        type: 'usertable/fetch',
        payload: values,
      });
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用 户 名 ">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手 机 号 ">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
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

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="评价时间">
              {getFieldDecorator('time')(<RangePicker />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      usertable: { UserTable },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => {router.push('/system-management/user-add')}}>
                开通用户
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={UserTable}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserManagement;
