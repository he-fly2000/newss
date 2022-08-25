import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css'
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const options = {
    "background": {
      "color": {
        "value": "rgb(35,39,65)"
      },
      "position": "50% 50%",
      "repeat": "no-repeat",
      "size": "cover"
    },
    "fullScreen": {
      "zIndex": 1
    },
    "interactivity": {
      "events": {
        "onClick": {
          "enable": true,
          "mode": "push"
        },
        "onHover": {
          "enable": true,
          "mode": "bubble",
          "parallax": {
            "force": 60
          }
        }
      },
      "modes": {
        "bubble": {
          "distance": 400,
          "duration": 2,
          "opacity": 1,
          "size": 40,
          "divs": {
            "distance": 200,
            "duration": 0.4,
            "mix": false,
            "selectors": []
          }
        },
        "grab": {
          "distance": 400
        },
        "repulse": {
          "divs": {
            "distance": 200,
            "duration": 0.4,
            "factor": 2,
            "speed": 1,
            "maxSpeed": 50,
            "easing": "ease-out-quad",
            "selectors": []
          }
        }
      }
    },
    "particles": {
      "color": {
        "value": "#ffffff"
      },
      "links": {
        "color": {
          "value": "#fff"
        },
        "distance": 150,
        "enable": true,
        "opacity": 0.4,
        "warp": true,
      },
      "move": {
        "attract": {
          "rotate": {
            "x": 600,
            "y": 1200
          }
        },
        "enable": true,
        "outModes": {
          "default": "bounce",
          "bottom": "bounce",
          "left": "bounce",
          "right": "bounce",
          "top": "bounce"
        },
        "speed": 2
      },
      "number": {
        "density": {
          "enable": true
        },
        "value": 50
      },
      "opacity": {
        "animation": {
          "speed": 1,
          "minimumValue": 0.1
        }
      },
      "shape": {
        "options": {
          "character": {
            "fill": false,
            "font": "Verdana",
            "style": "",
            "value": "*",
            "weight": "400"
          },
          "char": {
            "fill": false,
            "font": "Verdana",
            "style": "",
            "value": "*",
            "weight": "400"
          },
          "polygon": {
            "nb_sides": 5
          },
          "star": {
            "nb_sides": 5
          },
          "image": {
            "height": 32,
            "replace_color": true,
            "src": "/123.png",
            "width": 32
          },
          "images": {
            "height": 32,
            "replace_color": true,
            "src": "/123.png",
            "width": 32
          }
        },
        "type": "image"
      },
      "size": {
        "value": 16,
        "animation": {
          "speed": 40,
          "minimumValue": 0.1
        }
      },
      "stroke": {
        "color": {
          "value": "#000000",
          "animation": {
            "h": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "decay": 0,
              "sync": true
            },
            "s": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "decay": 0,
              "sync": true
            },
            "l": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "decay": 0,
              "sync": true
            }
          }
        }
      }
    }
  }

  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if (res.data.length === 0) {
        message.error("用户名或密码不匹配")
      } else {
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        navigate('/')
      }
    })
  }

  return (
    <div style={{ background: 'rgb(35,39,65)', height: '100%' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
      />
      <div className='formContainer'>
        <div className='logintitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
