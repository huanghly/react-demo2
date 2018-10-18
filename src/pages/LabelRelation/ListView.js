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
  Tree,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../EvaluationManagement/ManagementView.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const TreeNode = Tree.TreeNode;

const gData = [];

class SortList extends React.Component {
  state = {
    gData,
  }

  componentWillMount() {
    this.setState({
      gData: ["node 1", "node 2", "node 3", "node 4"]
    })
  }

  onDrop = (info) => {
    let newGData = this.state.gData;
    let start = this.state.gData.indexOf(info.dragNodesKeys[0]);
    let end = info.dropPosition-1;
    let cache = newGData[this.state.gData.indexOf(info.dragNodesKeys[0])];
    for(let i=start;i<end;i++){
      newGData[i] = newGData[i+1];
    }
    newGData[end] = cache;
    this.setState({gData: newGData});
  }

  render() {
    return (
      <Tree
        className="draggable-tree"
        defaultExpandedKeys={this.state.expandedKeys}
        draggable
        onDrop={this.onDrop}
      >
        {
          this.state.gData.map((item, index) => {
            return <TreeNode title={
              <div className={styles.sortListNode+" clearfix"}>
                <div className={styles.id}>{index+1}</div>
                <div className={styles.content}>{item}</div>
                <div className={styles.icon}><Icon type="colum-height" theme="outlined" /></div>
              </div>
            } key={item} ></TreeNode>
          })
        }
      </Tree>
    );
  }
}

const SortModal = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      //handleAdd(fieldsValue);
      handleModalVisible();
    });
  };
  return (
    <Modal
      destroyOnClose
      title="标签排序"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={styles.sortListHead+" clearfix"}>
        <span>序号</span>
        <span style={{margin:"0 70px"}}>标签名称</span>
        <span>操作</span>
      </div>
      <SortList />
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class LabelRelationList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    modalVisible: false,
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '来源名称',
      dataIndex: 'itemName',
    },
    {
      title: '已经关联标签',
      dataIndex: 'area',
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <a onClick={() => this.handleSetting(record)}>设置关联标签</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record)}>标签排序</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleSetting = (record) => {
    router.push('/labelrelationsetting');
  };

  handleSort = (record) => {

  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleAddSource = () => {
    router.push('/sourceconfigadd');
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
              {getFieldDecorator('sourcename')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标签名称">
              {getFieldDecorator('labelname')(<Input placeholder="请输入" />)}
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
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper title="标签关联">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <SortModal {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default LabelRelationList;
