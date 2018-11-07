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
  Icon,
  Table,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../EvaluationManagement/ManagementView.less';

import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

const columns = [{
  title: '标签名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '操作',
  render: (record) => (
    <div><Icon type="colum-height" theme="outlined" /></div>
  ),
}];

@connect(({ labelRelationOther }) => ({
  labelRelationOther,
}))
@Form.create()
class DragSortingTable extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    const {
      labelRelationOther: { LabelDisorderData },
    } = this.props;
    this.setState({data: LabelDisorderData.data})
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
  }

  submit() {
    const {
      handleModalVisible,
      chooseRow,
      dispatch,
    } = this.props;
    dispatch({
      type: 'labelRelationOther/orderResult',
      payload: {
        sourceId: chooseRow.sourceId,
        tags: this.state.data,
      },
      callback: () => {
        handleModalVisible();
      }
    });
  }

  render() {
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
          rowKey="id"
        />
        <div style={{textAlign:"right"}}><Button type="primary" onClick={this.submit.bind(this)}>提交</Button></div>
      </div>
    );
  }
}

const DragTable = DragDropContext(HTML5Backend)(DragSortingTable);

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const SortModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, chooseRow } = props;
  return (
    <Modal
      destroyOnClose
      title="标签排序"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <DragTable handleModalVisible={handleModalVisible} chooseRow={chooseRow}/>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ labelRelationTable, labelRelationOther, loading }) => ({
  labelRelationTable,
  labelRelationOther,
  loading: loading.models.labelRelationTable,
}))
@Form.create()
class LabelRelationList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    chooseRow: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '来源名称',
      dataIndex: 'sourceName',
    },
    {
      title: '已经关联标签',
      dataIndex: 'relativeTags',
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <Link to={{pathname:'/evaluation-center/label-relation-setting',tagDetail:record}}>设置关联标签</Link>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record)}>标签排序</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelRelationTable/fetch',
      payload: {
        page: 1,
        count: 10,
        sourceName: '',
      },
    });
  }

  handleSetting = (record) => {
    router.push('/evaluation-center/label-relation-setting');
  };

  handleModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    if(record != undefined){
      this.setState({chooseRow: record});
      dispatch({
        type: 'labelRelationOther/getList',
        payload: {
          sourceId: record.sourceId,
        },
        callback: () =>{
          this.setState({
            modalVisible: !!flag,
          });
        }
      });
    }
    else {
      this.setState({
        modalVisible: !!flag,
      });
    }
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
      type: 'labelRelationTable/fetch',
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
      type: 'labelRelationTable/fetch',
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
        type: 'labelRelationTable/fetch',
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
            <FormItem label="来源名称">
              {getFieldDecorator('sourceName')(<Input placeholder="请输入" maxLength="30"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标签名称">
              {getFieldDecorator('tagName')(<Input placeholder="请输入" maxLength="30"/>)}
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
      labelRelationTable: { labelRelationTable },
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
              data={labelRelationTable}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <SortModal {...parentMethods} modalVisible={modalVisible} chooseRow={this.state.chooseRow}/>
      </PageHeaderWrapper>
    );
  }
}

export default LabelRelationList;
