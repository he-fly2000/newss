import React from "react";
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

const { Header } = Layout;

const TopHeader = (props) => {
    const navigate = useNavigate()
    const changeCollapsed = () => {
        props.changeCollapsed()
    }

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: roleName,
                },
                {
                    key: '4',
                    danger: true,
                    label: (
                        <i style={{ display: 'block', fontStyle: 'normal', width: '100%' }} onClick={() => {
                            localStorage.removeItem("token")
                            navigate('/login')
                        }}>
                            退出
                        </i>
                    ),
                },
            ]}
        />
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>

            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: "right" }}>
                <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    );
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed",

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)