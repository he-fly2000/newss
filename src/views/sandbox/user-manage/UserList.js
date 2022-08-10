import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false)
  const [isUpdateVisible, setisUpdateVisible] = useState(false)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [current, setcurrent] = useState([])
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor",
    }
    axios.get('/users?_expand=role').then(res => {
      setdataSource(roleObj[roleId] === "superadmin" ? res.data : [
        ...res.data.filter(item => item.username === username),
        ...res.data.filter(item => item.region === region && roleObj[item.roleId] === "editor"),
      ])
    })
  }, [roleId, region, username])

  useEffect(() => {
    axios.get('/regions').then(res => {
      setregionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/roles').then(res => {
      setroleList(res.data)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      },
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        }
        return item.region === value
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => confirmMethod(item)} />
          <Button type="primary" shape="circle" disabled={item.default} icon={<EditOutlined />} onClick={() => handleUpdate(item)} />
        </div>
      }
    },
  ]

  const handleUpdate = async (item) => {
    await setisUpdateVisible(true)
    if (item.roleId === 1) {
      setisUpdateDisabled(true)
    } else {
      setisUpdateDisabled(false)
    }
    updateForm.current.setFieldsValue(item)
    setcurrent(item)
  }

  const handleChange = (item) => {
    // console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      // console.log(value)
      setisAddVisible(false)
      addForm.current.resetFields()
      axios.post('/users', {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        // console.log(res.data)
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setisUpdateVisible(false)
      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          console.log(item, '-------', value)
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`, value)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => { setisAddVisible(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}
        pagination={{
          pageSize: 5,
        }}
      />;
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisAddVisible(false)
        }}
        onOk={() => { addFormOk() }}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList}></UserForm>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => { updateFormOk() }}
      >
        <UserForm ref={updateForm} regionList={regionList} roleList={roleList}
          isUpdateDisabled={isUpdateDisabled} isUpdate={true} ></UserForm>
      </Modal>
    </div>
  )
}