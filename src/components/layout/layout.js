import React from 'react';
import { Layout, Menu } from 'antd';
import { ShareAltOutlined, RestOutlined, ProfileOutlined } from '@ant-design/icons';
import { Switch, Route, useHistory } from 'react-router-dom';
import Home from '../../views/home';
import SearchView from '../../views/search';
import './layout.css';

const { Header, Content, Sider } = Layout;

function MyLayout() {
    let history = useHistory();
    const routerClick = (path) => { history.push({ pathname: path }); }

    return (
        <Layout >
            <Header className="header">
                <div className="logo" />
                <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }} >
                    <Menu.Item key="1" onClick={() => { routerClick('/') }}>网盘</Menu.Item>
                    <Menu.Item key="2">动态</Menu.Item>
                    <Menu.Item key="3">分享</Menu.Item>
                </Menu>
            </Header>

            <Layout style={{ padding: '6px 0 0 0', height: '91.5vh' }}>
                <Sider width={200} className="site-layout-background">
                    <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}>
                        <Menu.Item key="1" onClick={() => { routerClick('/') }}><ProfileOutlined />全部文件</Menu.Item>
                        <Menu.Item key="2">图片</Menu.Item>
                        <Menu.Item key="3">文档</Menu.Item>
                        <Menu.Item key="4">视频</Menu.Item>
                        <Menu.Item key="5">种子</Menu.Item>
                        <Menu.Item key="6">音乐</Menu.Item>
                        <Menu.Item key="7">其它</Menu.Item>
                        <Menu.Item key="8"><ShareAltOutlined />我的分享</Menu.Item>
                        <Menu.Item key="9"><RestOutlined />回收站</Menu.Item>
                    </Menu>
                </Sider>

                <Layout style={{ padding: '0 3px 0' }}>
                    <Content className="site-layout-background"
                        style={{ padding: 6, margin: 0, minHeight: 280, backgroundColor: '#FFFFFF' }}  >
                        <Route render={({ location }) => (
                            <Switch location={location}>
                                <Route exact path="/" component={Home} />
                                <Route path="/search/:key" component={SearchView} />
                            </Switch>
                        )} />
                    </Content>
                </Layout>
            </Layout>

        </Layout>
    )
}

export default MyLayout;