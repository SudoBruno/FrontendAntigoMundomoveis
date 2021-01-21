import React, { useEffect, useState } from 'react';
import {
  Layout,
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Modal,
  Form,
  Select,
  notification,
  Divider,
} from 'antd';
import { Tooltip } from '@material-ui/core';
import {
  DoubleRightOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  BarcodeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import BarcodeReader from 'react-barcode-reader';

import Highlighter from 'react-highlight-words';

import api from '../../../services/api';

import './style.css';

const Option = Select.Option;

const { TextArea } = Input;

export default function PlantingMount() {
  class SearchTable extends React.Component {
    state = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
      searchText: '',
      searchedColumn: '',
    };

    getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                this.handleSearch(selectedKeys, confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Limpar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: (text) =>
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    });

    compareByAlph = (a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    };

    handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      this.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    handleReset = (clearFilters) => {
      clearFilters();
      this.setState({ searchText: '' });
    };

    handleTableChange = (pagination, filters, sorter) => {
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      });
    };

    render() {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',

          sorter: (a, b) => this.compareByAlph(a.id, b.id),
          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'Produto',
          dataIndex: 'productName',
          key: 'productName',

          sorter: (a, b) => this.compareByAlph(a.productName, b.productName),
          ...this.getColumnSearchProps('productName'),
        },
        {
          title: 'SubProduto',
          dataIndex: 'subProductName',
          key: 'subProductName',

          sorter: (a, b) =>
            this.compareByAlph(a.subProductName, b.subProductName),
          ...this.getColumnSearchProps('subProductName'),
        },
        {
          title: 'Quantidade que chegou',
          dataIndex: 'amountInput',
          key: 'amountInput',

          sorter: (a, b) => this.compareByAlph(a.amountInput, b.amountInput),
          ...this.getColumnSearchProps('amountInput'),
        },
        {
          title: 'Quantidade processada',
          dataIndex: 'amountOutput',
          key: 'amountOutput',

          sorter: (a, b) => this.compareByAlph(a.amountOutput, b.amountOutput),
          ...this.getColumnSearchProps('amountOutput'),
        },
        {
          title: 'PCP',
          dataIndex: 'pcp',
          key: 'pcp',

          sorter: (a, b) => this.compareByAlph(a.pcp, b.pcp),
          ...this.getColumnSearchProps('pcp'),
        },
        {
          title: 'Começou',
          dataIndex: 'start',
          key: 'start',

          sorter: (a, b) => this.compareByAlph(a.start, b.start),
          ...this.getColumnSearchProps('start'),
        },

        {
          title: 'Operação',
          colSpan: 2,
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <Link
                  to={`/mount/tag/${record.barCode}/sector/${sectorId}`}
                  style={{ color: 'rgb(0,0,0,0.65' }}
                  target="_blank"
                >
                  <BarcodeOutlined style={{ marginLeft: 20, fontSize: 24 }} />
                </Link>
                <DoubleRightOutlined
                  style={{ marginLeft: 20, fontSize: 24 }}
                  size={50}
                  // onClick={(e) => finishMount(e, record)}
                />
              </React.Fragment>
            );
          },
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={mounts}
          rowClassName={
            (record, index) => record.color
            // index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      );
    }
  }

  const [mounts, setMounts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sectorId, setSectorId] = useState(0);
  const [sectors, setSectors] = useState([]);
  const [sectorName, setSectorName] = useState('');
  const [showSector, setShowSector] = useState(true);

  const [alterMountRoute, setAlterMountRoute] = useState(false);
  const [showAlterMountRoute, setShowAlterMountRoute] = useState(false);

  const [barCode, setBarCode] = useState('');

  const [showInNextSector, setShowInNextSector] = useState(false);

  const [color, setColor] = useState('');
  const [productName, setProductName] = useState('');
  const [productionPlanControlName, setProductionPlanControlName] = useState(
    ''
  );
  const [subProductName, setSubProductName] = useState('');
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);

  const [showStart, setShowStart] = useState(false);

  const [showStartOtherSector, setShowStartOtherSector] = useState(false);

  const [isFinish, setIsFinish] = useState(false);

  const [reason, setReason] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [isAlterAmount, setIsAlterAmount] = useState(false);
  const [movement, setMovement] = useState('');
  const [mountId, setMountId] = useState(0);
  useEffect(() => {
    api.get(`plating/mount/sector/${sectorId}`, {}).then((response) => {
      setMounts(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
    });
  }, []);

  const handleSelectSector = (e) => {
    setRefreshKey((refreshKey) => refreshKey + 1);
    setSectorId(e[0]);
    setSectorName(e[1]);
    setShowSector(false);
  };

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const handleScan = async (e) => {
    const response = await api.get(`plating/mount/tag/${e}/sector/${sectorId}`);
    setBarCode(e);

    if (response.data.finish == null) {
      if (response.data.showSector == 0) {
        openNotificationWithIcon('error', 'setor errado', 'Setor errado!');
        setShowAlterMountRoute(true);
      } else {
        if (response.data.start == null) {
          setShowStart(true);
        } else {
          setShowInNextSector(true);
        }
      }
    } else {
      openNotificationWithIcon(
        'error',
        'Monte ja finalizado',
        'Esse monte ja foi finalizado'
      );
    }

    setColor(response.data.color);
    setProductName(response.data.productName);
    setProductionPlanControlName(response.data.pcp);
    setSubProductName(response.data.subProductName);
    setAmount(response.data.amount);
    setNewAmount(response.data.amount);
    setMountId(response.data.id);
  };

  const alterRoute = () => {
    openNotificationWithIcon(
      'success',
      'caminho alterado',
      'caminho alterado!'
    );
    setAlterMountRoute(true);
    setShowAlterMountRoute(false);

    setShowStartOtherSector(true);
  };

  const nextSector = async () => {
    if (amount != newAmount) {
      setShowReason(true);
      setMovement('output');
    } else {
      try {
        await api.put('plating/mount/finish', {
          amountOutput: newAmount,
          barCode,
          sectorId,
        });
        setShowInNextSector(false);
        openNotificationWithIcon(
          'success',
          'Monte finalizado',
          'Monte finalizado com sucesso'
        );
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao finalizar o monte',
          'Ocorreu um erro ao finalizar o monte'
        );
      }
    }
  };

  const startMount = async () => {
    if (amount != newAmount) {
      setShowReason(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
        });
        setShowStart(false);
        openNotificationWithIcon(
          'success',
          'Monte iniciado',
          'Monte iniciado com sucesso'
        );
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

  const startMountOtherSector = async () => {
    if (amount != newAmount) {
      setShowReason(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
        });
        setShowStartOtherSector(false);
        openNotificationWithIcon(
          'success',
          'Monte iniciado',
          'Monte iniciado com sucesso'
        );
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

  // const alterAmount = () => {
  //   if (!isAlterAmount) {
  //     setShowReason(true);
  //   }
  // };

  const handleSaveReason = async () => {
    setShowReason(false);

    await api.post('plating/loser/mount', {
      amountInput: amount,
      amountOutput: newAmount,
      mountId,
      movement,
      reason,
    });
    setAmount(newAmount);
  };

  return (
    <Layout
      style={{
        margin: '24px 16px',
        padding: '21px 24px 24px 24px',
        background: '#fff',
        minHeight: 280,
      }}
    >
      <BarcodeReader onScan={handleScan} onError={handleScan} />

      <SearchTable />
      {/* selecionar setor */}
      <Modal title="Selecione o setor" visible={showSector} width={500}>
        <Row gutter={5}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Selecione seu setor:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={sectorName}
                onChange={(e) => handleSelectSector(e)}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {sectors.map((option) => {
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
      </Modal>
      {/* alterar caminho do monte */}
      <Modal
        title="Alteração no caminho do monte"
        visible={showAlterMountRoute}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={() => setShowAlterMountRoute(false)}
          >
            Cancelar
          </Button>,
          <Button type="primary" onClick={alterRoute}>
            Sim
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={24}>
            <h3>
              Você está tentando iniciar um monte em um setor diferente do
              programado, deseja continuar?
            </h3>
          </Col>
        </Row>
      </Modal>
      {/* modal passar mount para o proximo setor */}
      <Modal
        title="Passar para o proximo setor"
        visible={showInNextSector}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => {
              setShowInNextSector(false);
            }}
          >
            Cancelar
          </Button>,
          <Button type="primary" onClick={nextSector}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Input name="pcp" value={productionPlanControlName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Input name="product" value={productName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Input name="color" value={color} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={5}>
          <Col span={16}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="SubProduto:"
              labelAlign={'left'}
            >
              <Input name="subProduct" value={subProductName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Quantidade:"
              labelAlign={'left'}
            >
              <Input
                name="amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>

      {/* modal start mount */}
      <Modal
        title="Iniciar monte"
        visible={showStart}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => setShowStart(false)}
          >
            Cancelar
          </Button>,
          <Button type="primary" onClick={startMount}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Input name="pcp" value={productionPlanControlName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Input name="product" value={productName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Input name="color" value={color} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={5}>
          <Col span={16}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="SubProduto:"
              labelAlign={'left'}
            >
              <Input name="subProduct" value={subProductName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Quantidade:"
              labelAlign={'left'}
            >
              <Input
                name="amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>

      {/* modal iniciando monte em setor diferente do programado */}

      <Modal
        title="Iniciar monte em setor diferente do programado"
        visible={showStartOtherSector}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => setShowStartOtherSector(false)}
          >
            Cancelar
          </Button>,
          <Button type="primary" onClick={startMountOtherSector}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Input name="pcp" value={productionPlanControlName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Input name="product" value={productName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Input name="color" value={color} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={5}>
          <Col span={16}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="SubProduto:"
              labelAlign={'left'}
            >
              <Input name="subProduct" value={subProductName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Quantidade:"
              labelAlign={'left'}
            >
              <Input
                name="amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Percebemos que a quantidade que foi dada entrada é diferente da que chegou, descreva o motivo"
        visible={showReason}
        width={500}
        footer={[
          <Button type="primary" onClick={(e) => setShowReason(false)}>
            cancelar
          </Button>,
          <Button type="primary" onClick={handleSaveReason}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={24}>
            <TextArea rows={4} onChange={(e) => setReason(e.target.value)} />
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
}
