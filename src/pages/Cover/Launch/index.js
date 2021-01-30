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
    api.get('sub-product/cover', {}).then((response) => {
      setCovers(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('cover/warehouse', {}).then((response) => {
      setWarehouses(response.data);
    });
  }, []);
  const [warehouses, setWarehouses] = useState([]);
  const [coverWarehouseId, setCoverWarehouseId] = useState(0);
  const [coverWarehouseName, setCoverWarehouseName] = useState('');
  const [coverStreetId, setCoverStreetId] = useState(0);
  const [coverStreetName, setCoverStreetName] = useState('');
  const [streets, setStreets] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setLaunched([]);
    setQuantity(0);
  };
  const handleInput = () => {
    let modal = {
      title: 'Armazenagem de capas',
      url: 'input',
      hidden: true,
      span: 12,
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const handleOutput = () => {
    let modal = {
      title: 'Saida de capas',
      url: 'output',
      hidden: false,
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

  const [pcp, setPCP] = useState('');

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
      coverWarehouseId,
      coverStreetId,
      pcp,
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

  const warehouseChange = async (e) => {
    setCoverWarehouseId(e[0]);
    setCoverWarehouseName(e[1]);
    const response = await api.get(`cover/street/warehouse/${e[0]}`);
    setStreets(response.data);
  };

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
              label="Armazém:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={coverWarehouseName}
                onChange={(e) => warehouseChange(e)}
              >
                {warehouses.map((option) => {
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
            <Form.Item labelCol={{ span: 23 }} label="Rua:" labelAlign={'left'}>
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={coverStreetName}
                onChange={async (e) => {
                  setCoverStreetId(e[0]);
                  setCoverStreetName(e[1]);
                }}
              >
                {streets.map((option) => {
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
        </Row>
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
                placeholder="quantidade"
                type={'number'}
                // value={product.amount}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row hidden={modalConfigure.hidden}>
          <Col span={24}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Input
                name="pcp"
                placeholder="Nome do pcp"
                type={'text'}
                // value={product.amount}
                onChange={(e) => setPCP(e.target.value)}
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
