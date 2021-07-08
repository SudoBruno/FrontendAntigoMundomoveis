import { DoubleRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Table, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import api from '../../../services/api';
import { Notification } from '../../Notification';

const Option = Select.Option;

export function SeccionadoraTable({ sectorId, isStopMachine = false, machineId }) {
  const [mounts, setMounts] = useState([{}]);
  const [mount, setMount] = useState({
    factoryEmployeeId: localStorage.getItem('userId'),
    productionPlanControlId: '',
    productionPlanControlName: '',
    subProducts: [
      {
        subProductId: '',
        subProductName: '',
        amount: '',
      },
    ],
    previousPlatingMountId: '',
    productId: '',
    productName: '',
    color: '',
  });
  const [showNextSector, setShowNextSector] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newAmount, setNewAmount] = useState(0);

  useEffect(() => {
    if (!isStopMachine) {
      api.get(`plating/mount/seccionadora/${sectorId}`, {}).then((response) => {
        setMounts(response.data);
      });
    } else {
      setMounts([{}]);
    }
  }, [sectorId]);

  async function finishMount(data) {

    setNewAmount(data.amountInput)
    setMount({
      factoryEmployeeId: localStorage.getItem('userId'),
      productionPlanControlId: data.pcpId,
      productionPlanControlName: data.pcpName,
      subProducts: [
        {
          subProductId: data.subProductId,
          subProductName: data.subProductName,
          amount: data.amountInput,
        },
      ],
      previousPlatingMountId: data.id,
      productId: data.productId,
      productName: data.productName,
      color: data.color,
    });

    setShowNextSector(true);
  }

  const nextSector = async () => {
    setLoading(true);

    try {
      mount.subProducts[0].amount = newAmount;
      mount.factorySectorId = sectorId;
      mount.machineId = machineId;


      const response = await api.post('plating/mount/tags', mount);
      Notification(
        'success',
        'Sucesso ao gerar etiquetas',
        'As etiquetas foram geradas com sucesso'
      );

      var win = window.open(
        `/mount/tag/${mount.previousPlatingMountId}`,
        '_blank'
      );
      win.focus();
      setShowNextSector(false);
    } catch (error) {
      console.error(error);
      Notification(
        'error',
        'Erro ao gerar etiqueta',
        'Erro ao passar para o proximo setor, tente novamente'
      );
    }
    setLoading(false);
  };

  class SeccionadoraTable extends React.Component {
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
          title: 'Quantidade',
          dataIndex: 'amountInput',
          key: 'amountInput',

          sorter: (a, b) => this.compareByAlph(a.amountInput, b.amountInput),
          ...this.getColumnSearchProps('amountInput'),
        },
        {
          title: 'PCP',
          dataIndex: 'pcpName',
          key: 'pcpName',

          sorter: (a, b) => this.compareByAlph(a.pcpName, b.pcpName),
          ...this.getColumnSearchProps('pcpName'),
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
          dataIndex: 'export { SeccionadoraTable };operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <DoubleRightOutlined
                  style={{ marginLeft: 20, fontSize: 24 }}
                  size={50}
                  onClick={(e) => {
                    e.preventDefault();
                    finishMount(record);
                  }}
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
          rowClassName={(record, index) => record.color}
        />
      );
    }
  }

  return (
    <>
      <SeccionadoraTable />
      <Modal
        title="Passar para o proximo setor"
        visible={showNextSector}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => {
              setShowNextSector(false);
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
              <Input name="pcp" value={mount.productionPlanControlName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Input name="product" value={mount.productName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Input name="color" value={mount.color} disabled />
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
              <Input name="subProduct" value={mount.subProducts[0].subProductName} disabled />
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


    </>
  );
}
