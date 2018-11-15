import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Form,
  Button,
  Divider,
  Tag,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '../EvaluationManagement/ManagementView.less';

const { Description } = DescriptionList;

/* eslint react/no-multi-comp:0 */

@connect(({ labelRelationTable, labelRelationOther, loading }) => ({
  labelRelationTable,
  labelRelationOther,
  loading: loading.models.labelRelationTable,
}))
@Form.create()
class LabelRelationSetting extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    tableData: []
  };

  columns = [
    {
      title: '标签名称',
      dataIndex: 'tagId',
    },
    {
      title: '状态',
      dataIndex: 'tagName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const tagDetail = this.props.location.tagDetail;
    if(tagDetail != undefined){
      dispatch({
        type: 'labelRelationTable/getSettingList',
        payload: {
          sourceId: tagDetail.sourceId,
        },
        callback: (data) => {
          let selectedTags = data.data.selectedTags;
          if(selectedTags != null) {
            let selectedRowKeys = [];
            selectedTags.map(item => {
              selectedRowKeys.push(item.tagId);
            });
            this.setState({ selectedRows: data.data.selectedTags, selectedRowKeys});
          }
          if(data.data.allTags != null) {
            this.setState({ tableData: data.data.allTags });
          }
        }
      });
    }
    else {
      router.push('/evaluation-center/label-relation-list')
    }
  }

  onChange = () => {

  };

  log = (id, e) =>{
    let newKeys = this.state.selectedRowKeys.concat();
    let newRows = this.state.selectedRows.concat();
    let keyIndex = newKeys.indexOf(id);
    let rowIndex = 0;
    newRows.map((item, index) => {
      if(item.tagId == id) {
        rowIndex = index;
      }
    })
    newKeys.splice(keyIndex, 1);
    newRows.splice(rowIndex, 1);
    this.setState({selectedRowKeys: newKeys, selectedRows: newRows})
  };

  submit() {
    const { dispatch, labelRelationTable: {LabelSettingData} } = this.props;
    dispatch({
      type: 'labelRelationOther/update',
      payload: {
        sourceId: LabelSettingData.data.sourceId,
        tagIds: this.state.selectedRowKeys.join(',')
      },
      callback: () => {
        dispatch({
          type: 'labelRelationTable/getSettingList',
          payload: {
            sourceId: LabelSettingData.data.sourceId,
          },
          callback: (data) => {
            let selectedTags = data.data.selectedTags;
            let selectedRowKeys = [];
            console.log(selectedTags)
            if(selectedTags) {
              selectedTags.map(item => {
                selectedRowKeys.push(item.tagId);
              });
              this.setState({ tableData: data.data.allTags, selectedRows: data.data.selectedTags, selectedRowKeys});
            }
          }
        });
      }
    });
  }

  render() {
    console.log(this.state.tableData)
    const { labelRelationTable: {LabelSettingData} } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // let newTableData = this.state.tableData;
        // console.log(newTableData[selectedRowKeys])
        // newTableData[selectedRowKeys].isChoose = !newTableData[selectedRowKeys].isChoose;
        // console.log(newTableData[selectedRowKeys])
        // this.setState({tableData: newTableData})
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRows: selectedRows, selectedRowKeys: selectedRowKeys})
      },
      // getCheckboxProps: record => ({
      //   defaultChecked: record.isSelected, // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
    
    let tagList = [];
    for(let i = 0, length = this.state.selectedRows.length;i < length;i++){
      tagList.push(
        <Tag closable 
          onClose={this.log.bind(this, this.state.selectedRows[i].tagId)} 
          key={this.state.selectedRows[i].tagId} 
          style={{marginBottom:"10px"}}>
          {this.state.selectedRows[i].tagName}
        </Tag>)
    }

    return (
      <PageHeaderWrapper title="标签关联">
        <Card bordered={false}>
          <Button type="primary" style={{ float: 'right', marginBottom: 24 }} onClick={this.submit.bind(this)}>提交</Button> 
          <Button type="default" style={{ float: 'right', marginBottom: 24, marginRight: 10 }} onClick={() => {router.push('/evaluation-center/label-relation-list')}}>返回</Button>  
          <DescriptionList size="large" title="设置标签关联" style={{ marginBottom: 32 }}>
            <Description term="来源名称">{LabelSettingData.success != undefined?LabelSettingData.data.sourceName:''}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
            <Description term="标签名称" style={{ width: "100%" }}>
              {tagList}
            </Description>
          </DescriptionList>
          <div>

          </div>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.tableList}>
            <Table rowKey="tagId" rowSelection={rowSelection} columns={this.columns} dataSource={this.state.tableData} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default LabelRelationSetting;