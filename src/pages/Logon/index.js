import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';

import './style.css';

import api from '../../services/api';
import factory from '../../assets/factory.svg';
import logo from '../../assets/logo.png';
import { LoadingOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
require('dotenv').config();

export default function Logon() {
  const [user_name, SetUserName] = useState('');
  const [password, SetPassword] = useState('');
  const history = useHistory();
  const [loading, setLoading] = useState('none');

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading('');

    try {
      const test = await api.get('/hour');
      console.log(test);
      const response = await api.post('sessions', { user_name, password });
      Cookies.set('token', String(response.data.token));
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('access_level', response.data.user.access_level);

      api.defaults.headers.authorization = response.data.token;
      if (
        response.data.user.access_level === '1' ||
        response.data.user.access_level === '4' ||
        response.data.user.access_level === '7'
      ) {
        history.push('/profile');
        setLoading('none');
      } else if (response.data.user.access_level === '2') {
        // history.push('/launch-product');
        window.open(
          'https://mundomoveis.vercel.app/production/launch',
          '_blank'
        );
        setLoading('none');
      } else if (response.data.user.access_level === '3') {
        history.push('/launch-expedition');
        setLoading('none');
      } else if (response.data.user.access_level === '5') {
        history.push('/cover/launch');
        setLoading('none');
      } else if (response.data.user.access_level === '6') {
        history.push('/callList');
        setLoading('none');
      }
      setLoading('none');
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao tentar o login',
        'Usuário ou Senha incorretos'
      );
      setLoading('none');
      console.error(error);
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logo} alt="logo" />

        <form onSubmit={handleLogin}>
          <h1>Faça seu login</h1>

          <input
            placeholder="Seu Usuário"
            value={user_name}
            onChange={(e) => SetUserName(e.target.value)}
          />
          <input
            placeholder="Sua Senha"
            type="password"
            // value={password}
            onChange={(e) => SetPassword(e.target.value)}
          />

          <button type="submit" loading={loading} className="button">
            Entrar{' '}
            <LoadingOutlined style={{ marginLeft: 16, display: loading }} />
          </button>
        </form>
      </section>
      <img src={factory} alt="Login" className="calendar" />
    </div>
  );
}
