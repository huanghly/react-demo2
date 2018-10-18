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

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class SourceConfigEdit extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  returnSourceList = () => {
    router.push('/sourceconfiglist');
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
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

    return (
      <PageHeaderWrapper
        title={"来源配置-新增"}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={"密钥"}>
              {getFieldDecorator('title', {})(<label>123123123123</label> )}
            </FormItem>
            <FormItem {...formItemLayout} label={"来源名称"}>
              {getFieldDecorator('title', {
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
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      模版一
                    </Radio>
                    <Radio value="2">
                      模版二
                    </Radio>
                    <Radio value="3">
                      自定义
                    </Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={"评价后续动作"}>
              {getFieldDecorator('action', {
                rules: [
                  {
                    required: true,
                    message: "页面地址不能为空",
                  },
                ],
              })(<Input placeholder={"请输入评价完成后打开页面地址"} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
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

export default SourceConfigEdit;
