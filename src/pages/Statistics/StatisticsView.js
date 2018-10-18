import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  Select,
  Rate,
} from 'antd';
import {
  ChartCard,
  MiniArea,
  Field,
  Bar,
  Pie,
} from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';

import styles from './StatisticsView.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Statistics extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    loading: true,
    type: 'star'
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  handleTypeChange = e => {
    this.setState({ type: e.target.value });
  }

  render() {
    const { rangePickerValue, salesType, loading: propsLoding, currentTabKey } = this.state;
    const { chart, loading: stateLoading } = this.props;
    const {
      visitData2,
      salesData,
      searchData,
      offlineData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    const loading = propsLoding || stateLoading;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: "排名",
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: "评价标签",
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: "用户选择次数",
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: (
          <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />
        ),
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 },
    };

    return (
      <PageHeaderWrapper title="评价统计">
        <GridContent>
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title={
                  <FormattedMessage id="app.statistics.total-num" defaultMessage="参与评价历史人次" />
                }
                loading={loading}
                total={() => 126560}
                contentHeight={46}
              >
                <Trend flag="up" style={{ marginRight: 16 }}>
                  <FormattedMessage id="app.statistics.week" defaultMessage="周同比" />
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  <FormattedMessage id="app.statistics.day" defaultMessage="日环比" />
                  <span className={styles.trendText}>11%</span>
                </Trend>
                <div style={{float:"right"}}>
                  <Field
                    label={
                      <FormattedMessage id="app.statistics.today-num" defaultMessage="今日评价人次" />
                    }
                    value={`${numeral(12423).format('0,0')}`}
                  />
                </div>

              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title={
                  <FormattedMessage id="app.statistics.total-matter" defaultMessage="接入事项总量" />
                }
                loading={loading}
                total={() => 126560}
                contentHeight={46}
              >
                <div style={{position:"absolute", right:"0", top:"-80px"}}>
                  <label>选择来源</label>
                  <Select placeholder="请选择" style={{width:"200px", marginLeft:"10px"}}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                  </Select>
                </div>
                <Trend flag="up" style={{ marginRight: 16 }}>
                  <FormattedMessage id="app.statistics.week" defaultMessage="周同比" />
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  <FormattedMessage id="app.statistics.day" defaultMessage="日环比" />
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </ChartCard>
            </Col>
          </Row>
          
          <Row style={{marginBottom:"24px"}}>
            <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <div className={styles.salesCard}>
                <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
                  <TabPane
                    tab={<FormattedMessage id="app.statistics.trend-rank" defaultMessage="" />}
                    key=""
                  >
                    <Row style={{position:"absolute", top:"12px", left:"120px"}}>
                      <label style={{marginLeft:"20px"}}>选择来源</label>
                      <Select placeholder="请选择" style={{width:"200px", marginLeft:"10px"}}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                      </Select>
                    </Row>
                    <Row>
                      <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesBar}>
                          <Bar
                            height={295}
                            title={
                              <FormattedMessage
                                id="app.statistics.trend"
                                defaultMessage="参与评价人次趋势"
                              />
                            }
                            data={salesData}
                          />
                        </div>
                      </Col>
                      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesRank}>
                          <h4 className={styles.rankingTitle}>
                            <FormattedMessage
                              id="app.statistics.rank"
                              defaultMessage="事项评价星级排行"
                            />
                            <Radio.Group value={this.state.type} onChange={this.handleTypeChange} style={{float:"right"}}>
                              <Radio.Button value="star">星级</Radio.Button>
                              <Radio.Button value="up">涨幅</Radio.Button>
                              <Radio.Button value="down">跌幅</Radio.Button>
                            </Radio.Group>
                          </h4>
                          <ul className={styles.rankingList}>
                            {this.rankingListData.map((item, i) => (
                              <li key={item.title}>
                                <span
                                  className={`${styles.rankingItemNumber} ${
                                    i < 3 ? styles.active : ''
                                  }`}
                                >
                                  {i + 1}
                                </span>
                                <span className={styles.rankingItemTitle} title={item.title}>
                                  {item.title}
                                </span>
                                <span className={styles.rankingItemValue} style={{display:"inline-block"}}>
                                  <Rate disabled defaultValue={4.2} />
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Row>
          
          <Row>
            <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <div className={styles.salesCard}>
                <Tabs tabBarExtraContent={salesExtra} size="large">
                  <TabPane
                    tab={<FormattedMessage id="app.statistics.tag" defaultMessage="" />}
                    key=""
                  >
                    <Row gutter={24}>
                      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                          bordered={false}
                          style={{ marginTop: 24 }}
                        >
                          <div style={{marginBottom:"20px"}}>
                            <label>选择来源</label>
                            <Select placeholder="请选择" style={{width:"200px", marginLeft:"10px"}}>
                              <Option value="1">1</Option>
                              <Option value="2">2</Option>
                              <Option value="3">3</Option>
                              <Option value="4">4</Option>
                              <Option value="5">5</Option>
                            </Select>
                          </div>
                          <Table
                            rowKey={record => record.index}
                            size="small"
                            columns={columns}
                            dataSource={searchData}
                            pagination={{
                              style: { marginBottom: 0 },
                              pageSize: 5,
                            }}
                          />
                        </Card>
                      </Col>
                      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                          loading={loading}
                          className={styles.salesCard}
                          bordered={false}
                          title={
                            <FormattedMessage
                              id="app.statistics.proportion"
                              defaultMessage="用户选择次数"
                            />
                          }
                          bodyStyle={{ padding: 24 }}
                          style={{ marginTop: 24, minHeight: 509 }}
                        >
                          <Pie
                            hasLegend
                            subTitle={"总次数"}
                            total={() => <span>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</span>}
                            data={salesPieData}
                            valueFormat={value => <span>{value}次</span>}
                            height={248}
                            lineWidth={4}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Row>
          

          
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Statistics;
