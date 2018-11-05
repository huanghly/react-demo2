import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
  Select,
  Checkbox,
  Table,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatDateTime } from '@/utils/utils';

import styles from '../EvaluationManagement/ManagementView.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const plainOptions = ['一星', '二星', '三星', '四星', '五星'];
const defaultCheckedList = [];

@connect(({ labelWareroomOther }) => ({
  labelWareroomOther,
}))
@Form.create()
class SortModal extends React.Component {

  state = {
    checkedList: defaultCheckedList,
    indeterminate: false,
    checkAll: false,
  }
  
  okHandle = () => {
    const { form, handleModalVisible, tableRefresh, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let scoreIdsList = this.state.checkedList.concat();
      scoreIdsList.map((item, index) => {
        let itemStr = '';
        switch(item){
          case '一星': itemStr = '1';break;
          case '二星': itemStr = '2';break;
          case '三星': itemStr = '3';break;
          case '四星': itemStr = '4';break;
          case '五星': itemStr = '5';break;
          default: break;
        }
        scoreIdsList.splice(index,1,itemStr);
      })

      dispatch({
        type: 'labelWareroomOther/add',
        payload: {
          name: fieldsValue.name,
          scoreIds: scoreIdsList.join(','),
        },
        callback: () => {
          handleModalVisible();
          tableRefresh();
        }
      });
      
    });
  };

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
  
    const { modalVisible, handleModalVisible} = this.props;

    return (
      <Modal
        destroyOnClose
        title="标签排序"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={"标签名称"}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: "来源不能为空",
                },
              ],
            })(<Input placeholder={"来源名称"} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={"标签登记"}
          >
            {getFieldDecorator('scoreIds', {
              rules: [
                {
                  required: true,
                  message: "星级不能为空",
                },
              ],
            })(
            <div>            
              <div>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  全选
                </Checkbox>
              </div>
              <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </div>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
  
}

const statusMap = [
  {key:'1',icon:'success',text:'发布'},
  {key:'4',icon:'default',text:'未发布'},
  {key:'8',icon:'error',text:'撤回'},
];

@connect(({ labelWareroomTable, labelWareroomOther, loading }) => ({
  labelWareroomTable,
  labelWareroomOther,
  loading: loading.models.labelWareroomTable,
}))
@Form.create()
class RelationWareroomList extends PureComponent {
  state = {
    selectedRowKeys: [],
    formValues: {},
    modalVisible: false,
    tableData: []
  };

  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
    },
    {
      title: '标签等级',
      dataIndex: 'score',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (val) => {
        for(let i=0;i<statusMap.length;i++){
          if(val == statusMap[i].key) {
            return <Badge status={statusMap[i].icon} text={statusMap[i].text} />
          }
        }
      },
    },
    {
      title: '创建时间',
      render: (record) => (
        formatDateTime(record.gmtCreate)
      ),
    },
    {
      title: '操作',
      render: (record) => {

        if(record.state == 4||record.state == 8)
          return (
            <Fragment>
              <a onClick={() => this.handleUpdate(record, 1)}>发布</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleUpdate(record, 2)}>删除</a>
            </Fragment>
          )
        else if(record.state == 1)
          return (
            <Fragment>
              <a onClick={() => this.handleUpdate(record, 8)}>撤回</a>
          </Fragment>
          )
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelWareroomTable/fetch',
      payload: {
        name: '',
        state: '',
      },
      callback: (data) => {
        this.setState({tableData: data.data})
      }
    });
  }

  handleUpdate = (record, state) => {
    const { dispatch } = this.props;
    let title = '';
    switch (state) {
      case 1: title = '发布'; break;
      case 4: title = '删除'; break;
      case 8: title = '撤回'; break;
      default: break;
    }
    let that = this;
    confirm({
      title: '是否'+title+'该标签?',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'labelWareroomOther/update',
          payload: {
            state: state,
            tagIds: record.id,
          },
          callback: () => {
            dispatch({
              type: 'labelWareroomTable/fetch',
              payload: {
                name: '',
                state: '',
              },
              callback: (data) => {
                message.success('操作成功');
                that.setState({
                  tableData: data.data,
                  selectedRowKeys: []
                })
              }
            });
          }
        });
      },
      onCancel() {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'labelWareroomTable/fetch',
      payload: {
        name: '',
        state: '',
      },
      callback: (data) => {
        this.setState({
          tableData: data.data,
          selectedRowKeys: []
        })
      }
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
        type: 'labelWareroomTable/fetch',
        payload: values,
        callback: (data) => {
          this.setState({
            tableData: data.data,
            selectedRowKeys: []
          })
        }
      });
    });
  };

  handleStateBatchUpdate = (state) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelWareroomOther/update',
      payload: {
        state: state,
        tagIds: this.state.selectedRowKeys.join(','),
      },
      callback: () => {
        dispatch({
          type: 'labelWareroomTable/fetch',
          payload: {
            name: '',
            state: '',
          },
          callback: (data) => {
            message.success('批量操作成功');
            this.setState({
              tableData: data.data,
              selectedRowKeys: []
            })
          }
        });
      }
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
            <FormItem label="标签名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择">
                  <Select.Option value="1">发布</Select.Option>
                  <Select.Option value="4">未发布</Select.Option>
                  <Select.Option value="8">撤回</Select.Option>
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  tableRefresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelWareroomTable/fetch',
      payload: {
        name: '',
        state: '',
      },
      callback: (data) => {
        this.setState({tableData: data.data})
      }
    });
  }

  render() {
    const { loading } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      tableRefresh: this.tableRefresh,
    };

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys})
      },
    };

    return (
      <PageHeaderWrapper title="评价标签库">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              <Button type="primary" onClick={() => this.handleStateBatchUpdate(1)}>
                批量发布
              </Button>
              <Button type="default" onClick={() => this.handleStateBatchUpdate(8)}>
                批量撤回
              </Button>
              <Button type="danger" onClick={() => this.handleStateBatchUpdate(2)}>
                批量删除
              </Button>
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={this.columns} dataSource={this.state.tableData} loading={loading}/>
          </div>
        </Card>
        <SortModal {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default RelationWareroomList;
