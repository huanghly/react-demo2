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
class SourceConfigAdd extends PureComponent {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceOther/templateList',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'sourceOther/add',
          payload: values,
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
      sourceOther: { templateList },
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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    let templateRadioList = [];
    if(Object.keys(templateList).length != 0 && templateList.success) {
      for(let i = 0, length = templateList.data.length;i < length;i++){
        templateRadioList.push(<Radio value={templateList.data[i].id} key={templateList.data[i].id}>{templateList.data[i].name}</Radio>)
      }
    }

    return (
      <PageHeaderWrapper
        title={"来源配置-新增"}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={"来源名称"}>
              {getFieldDecorator('sourceName', {
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
              label={"评价模版"}
            >
              <div>
                {getFieldDecorator('templateId', {
                  rules: [
                    {
                      required: true,
                      message: "模板不能为空",
                    },
                  ],
                })(
                  <Radio.Group>
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
                    message: "页面地址不能为空且必须是一个合法的地址",
                    type: 'url'
                  },
                ],
              })(<Input placeholder={"请输入评价完成后打开页面地址"} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                创建
              </Button>
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

export default SourceConfigAdd;
