import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Form,
  Input,
  Button,
  Card,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ sourceOther, loading }) => ({
  sourceOther,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class SourceConfigEdit extends PureComponent {

  componentWillMount() {
    const { dispatch } = this.props;
    const sourceMsg = this.props.location.sourceMsg;
    if(sourceMsg != undefined) {
      dispatch({
        type: 'sourceOther/getSourceInfo',
        payload: {
          sourceId: sourceMsg.sourceId,
        },
      });
    }
    else {
      router.push('/evaluation-center/source-config-list');
    }
  }

  handleSubmit = e => {
    const { dispatch, form,
      sourceOther: { sourceInfo }, 
          } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          sourceId: sourceInfo.data.sourceId,
          ...values,
        };
        dispatch({
          type: 'sourceOther/updateInfo',
          payload: params,
        });
      }
    });
  };

  returnSourceList = () => {
    router.push('/evaluation-center/source-config-list');
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
      sourceOther: { sourceInfo },
    } = this.props;

    const sourceMsg = this.props.location.sourceMsg;

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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    let templateRadioList = [];
    if(Object.keys(sourceInfo).length != 0 && sourceInfo.success) {
      for(let i = 0, length = sourceInfo.data.templateList.length;i < length;i++){
        templateRadioList.push(<Radio value={sourceInfo.data.templateList[i].id} key={sourceInfo.data.templateList[i].id}>{sourceInfo.data.templateList[i].name}</Radio>)
      }
    }
    return (
      <PageHeaderWrapper
        title={"来源配置-编辑"}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={"密钥"}>
              {getFieldDecorator('idCode', {})(<label>{Object.keys(sourceInfo).length != 0?sourceInfo.data.idCode:''}</label> )}
            </FormItem>
            <FormItem {...formItemLayout} label={"来源名称"}>
              {getFieldDecorator('sourceName', {
                rules: [
                  {
                    required: true,
                    message: "来源不能为空",
                  },
                ],
                initialValue: Object.keys(sourceInfo).length != 0?sourceInfo.data.sourceName:'',
              })(<Input placeholder={"来源名称"} disabled={sourceMsg != undefined && sourceMsg.state == 1?true:false}/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={"评价模版"}
            >
              <div>
                {getFieldDecorator('templateId', {
                  initialValue: Object.keys(sourceInfo).length != 0?sourceInfo.data.selectedTemplateId:'',
                })(
                  <Radio.Group disabled={sourceMsg != undefined && sourceMsg.state == 1?true:false}>
                    {templateRadioList}
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={"评价后续动作"}>
              {getFieldDecorator('backUrl', {
                rules: [
                  {
                    required: true,
                    message: "页面地址不能为空",
                  },
                ],
                initialValue: Object.keys(sourceInfo).length != 0?sourceInfo.data.backUrl:'',
              })(<Input placeholder={"请输入评价完成后打开页面地址"} disabled={sourceMsg != undefined && sourceMsg.state == 1?true:false}/>)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {
                sourceMsg != undefined && sourceMsg.state != 1 &&
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
              }
              <Button style={{ marginLeft: 8 }} onClick={this.returnSourceList}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SourceConfigEdit;
