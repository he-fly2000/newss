import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import {
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { connect } from 'react-redux';


const { Sider } = Layout;

const SideMenu = (props) => {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      setMenu(res.data)
    })
  }, [])
  const navigate = useNavigate();
  const location = useLocation().pathname
  const openKeys = ["/" + useLocation().pathname.split("/")[1]]
  const onClick = (e) => {
    navigate(e.key)
  }

  const getItem = (
    label,
    key,
    icon,
    children,
    type,
  ) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }

  const renderMenu = (menuList) => {
    const items = [];
    menuList?.forEach((item) => {
      const child = [];
      if (checkPagePermission(item)) {
        if (item.children?.length > 0) {
          item.children.forEach((itemchildren) => {
            if (checkPagePermission(itemchildren)) {
              child.push(getItem((
                <i style={{ fontStyle: 'normal' }}>
                  {itemchildren.title}
                </i>
              ), itemchildren.key, <UserOutlined />))
            }
          })
          items.push(getItem((
            <i style={{ fontStyle: 'normal' }}>
              {item.title}
            </i>
          ), item.key, <UserOutlined />, child))
        } else {
          items.push(getItem((
            <i style={{ fontStyle: 'normal' }}>
              {item.title}
            </i>
          ), item.key, <UserOutlined />))
        }
      }
    })
    return items
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu
            onClick={onClick}
            theme="dark"
            mode="inline"
            selectedKeys={location}
            defaultOpenKeys={openKeys}
            items={renderMenu(menu)}
          />
        </div>
      </div>
    </Sider>
  )
}


const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu)