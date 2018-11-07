import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Checkbox,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ userother }) => ({
  userother,
}))
@Form.create()
class UserAdd extends PureComponent {

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.roleIds = values.roleIds.join(',');
        dispatch({
          type: 'userother/add',
          payload: values,
          callback: () => {
            message.success('操作成功');
            router.push('/system-management/user-management');
          }
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const userInfo = this.props.location.userInfo;

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="menu.system-management.user-edit" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={'用户名'}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空',
                  },
                ],
              })(<Input placeholder={'用户名'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'姓名'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '姓名不能为空',
                  },
                ],
              })(<Input placeholder={'用户名'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'手机号'}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '手机号不能为空',
                  },
                ],
              })(<Input placeholder={'手机号'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'电子邮箱'}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '电子邮箱不能为空且必须格式正确',
                    type: 'email'
                  },
                ],
              })(<Input placeholder={'电子邮箱'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'密码'}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
              })(<Input type='password' placeholder={'密码'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'授予角色'}>
              {getFieldDecorator('roleIds', {
                rules: [
                  {
                    required: true,
                    message: '角色不能为空',
                  },
                ],
              })(
                <Checkbox.Group>
                  <Checkbox value="0">
                    超级管理员
                  </Checkbox>
                  <Checkbox value="1">
                    用户
                  </Checkbox>
                </Checkbox.Group>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() =>{router.push('/system-management/user-management');}}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserAdd;
