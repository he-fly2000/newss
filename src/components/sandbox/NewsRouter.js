import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission';
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd';
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft';
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory';
import Audit from '../../views/sandbox/audit-manage/Audit';
import AuditList from '../../views/sandbox/audit-manage/AuditList';
import Unpublished from '../../views/sandbox/publish-manage/Unpublished';
import Published from '../../views/sandbox/publish-manage/Published';
import Sunset from '../../views/sandbox/publish-manage/Sunset';
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview';
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate';
import { Spin } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": < Unpublished />,
    "/publish-manage/published": < Published />,
    "/publish-manage/sunset": <Sunset />,
}

const NewsRouter = (props) => {
    const [BackRouteList, setBackRouteList] = useState()

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkuUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        <Spin size="large" spinning={props.isLoading}>
            <Routes>
                {
                    BackRouteList?.map(item => {
                        if (checkRoute(item) && checkuUserPermission(item)) {
                            return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} />
                        } else {
                            return null
                        }
                    })
                }
                <Route path="/" element={<Navigate to="/home" />} />
                {
                    BackRouteList?.length > 0 && <Route path="*" element={<Nopermission />} />
                }
            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsRouter)