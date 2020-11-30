import React, { useState, useEffect } from 'react';
import {
  BarcodeOutlined,
  UndoOutlined,
  ToolOutlined,
  SearchOutlined,
  FileExcelOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  SwapOutlined,
  RedoOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import BarcodeReader from 'react-barcode-reader';
import { Route, Link, Redirect } from 'react-router-dom';
import './style.css';

import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Modal,
  Select,
  Divider,
  notification,
  Form,
} from 'antd';

import api from '../../../services/api';
import Highlighter from 'react-highlight-words';

const Option = Select.Option;

export default function CoverLaunch() {
  const [modalConfigure, setModalConfigure] = useState({
    title: '',
    url: '',
    hidden: true,
    span: 12,
  });

  useEffect(() => {
    api.get('sub-product', {}).then((response) => {
      setCovers(response.data);
    });
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setLaunched([]);
    setQuantity(0);
  };
  const handleInput = () => {
    let modal = {
      title: 'Armazenagem de produtos finalizados',
      url: 'input',
      hidden: false,
      span: 12,
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const handleOutput = () => {
    let modal = {
      title: 'Saida de produtos finalizados',
      url: 'output',
      hidden: true,
      span: 12,
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const [covers, setCovers] = useState([]);
  const [launched, setLaunched] = useState([]);

  const [quantity, setQuantity] = useState(0);
  const [coverName, setCoverName] = useState('');
  const [coverId, setCoverId] = useState(0);

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }
  function ButtonClick(e) {
    e.preventDefault();
    let data = {
      idSubProduct: coverId,
      quantity: quantity,
      idUser: localStorage.getItem('userId'),
    };
    Launch(data);
  }

  async function Launch(data) {
    try {
      const response = await api.post(`cover/${modalConfigure.url}`, data);

      openNotificationWithIcon(
        'success',
        'Lançado com sucesso',
        'Código lançado com sucesso'
      );
      setLaunched([...launched, response.data]);
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao lançar código',
        error.response.data.message
      );
    }
  }

  return (
    <>
      <div className="container-cover">
        <div className="cover-launch-buttons">
          <button type="submit" className="cover-input" onClick={handleInput}>
            <DownloadOutlined style={{ marginRight: 8 }} />
            Entrada
          </button>

          <button type="submit" className="cover-output" onClick={handleOutput}>
            <UploadOutlined rotate={180} style={{ marginRight: 8 }} />
            Saida
          </button>
        </div>
        <div className="cover-info">
          <h1>Entradas hoje: </h1>
          <h1>Estoque atual: </h1>
          <h1>Saídas hoje: </h1>
        </div>
      </div>

      <Modal
        title={modalConfigure.title}
        visible={show}
        onCancel={handleClose}
        width={750}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Fechar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Capa:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={coverName}
                onChange={async (e) => {
                  setCoverId(e[0]);
                  setCoverName(e[1]);
                }}
              >
                {covers.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={[option.id, option.name]}>
                        {option.name}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Quantidade:"
              labelAlign={'left'}
            >
              <Input
                name="amount"
                placeholder="Digite o código"
                type={'number'}
                // value={product.amount}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <button className="lancar" onClick={ButtonClick}>
          <CheckOutlined />
        </button>

        <Divider />
      </Modal>
    </>
  );
}
