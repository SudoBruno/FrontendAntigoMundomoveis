import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined, PlusOutlined, SearchOutlined
} from '@ant-design/icons';
import { Tooltip } from '@material-ui/core/';
import {
  Button,
  Col,
  Divider,
  Form, Input, Layout,
  Modal,
  notification, Popconfirm, Row,
  Select, Space, Table
} from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import api from '../../services/api';

const Option = Select.Option;

export default function ProductionLine() {
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

          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',

          sorter: (a, b) => this.compareByAlph(a.name, b.name),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Capacidade maxima',
          dataIndex: 'maximum_production',
          key: 'maximum_production',

          sorter: (a, b) =>
            this.compareByAlph(a.maximum_production, b.maximum_production),
          ...this.getColumnSearchProps('maximum_production'),
        },
        {
          title: 'Criado em:',
          dataIndex: 'created_at',
          key: 'created_at',
          sorter: (a, b) => this.compareByAlph(a.created_at, b.created_at),
          ...this.getColumnSearchProps('created_at'),
        },
        {
          title: 'Operação',
          colSpan: 2,
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <EditOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(record)}
                />
                <Popconfirm
                  onConfirm={() => handleDeleteFunction(record.id)}
                  title="Confirmar remoção?"
                >
                  <a href="#" style={{ marginLeft: 20 }}>
                    {' '}
                    <DeleteOutlined style={{ color: '#ff0000' }} />
                  </a>
                </Popconfirm>
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={productionLines} />;
    }
  }

  const [productionLines, setProductionLine] = useState([]);
  const [selectSectors, setSelectSector] = useState([
    { sector: '', sequence: '' },
  ]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [maximumProduction, setMaximumProduction] = useState('');
  const [lastSector, setLastSector] = useState(1);
  const [selectShifts, setSelectShifts] = useState([{ productionLineId: '', shifId: '' }]);
  const [shift, setShift] = useState([{}]);


  useEffect(() => {
    api.get('production-line', {}).then((response) => {
      setProductionLine(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('shift', {}).then((response) => {
      setShift(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    setMaximumProduction(e.maximum_production);

    let response = await api.get(`production-line-sector/${e.id}`);
    setSelectSector(response.data);

    try {
      setLastSector(response.data[0].last_sector);
    } catch (error) {
      setLastSector(0);
    }

    response = await api.get(`production-line-shift/${e.id}`);
    console.log(response.data);

    try {
      setSelectShifts(response.data);
    } catch (error) {
      console.log(error);
    }


    handleShow();
  }

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    const data = {
      id,
      sectors: selectSectors,
      shifts: selectShifts,
      name,
      maximum_production: maximumProduction,
      last_sector: lastSector,
    };
    console.log(data);
    if (name == '') {
      setError('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          const response = await api.post('production-line', data);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'A linha foi criado com sucesso'
          );
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'A linha não foi adicionado'
          );
        }
      } else {
        try {
          const response = await api.put('production-line', data);

          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'A linha foi alterado com sucesso'
          );

          setId(0);
          setName('');
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'A linha não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'A linha não foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`production-line/${id}`);
      setProductionLine(
        productionLines.filter((productionLine) => productionLine.id != id)
      );
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'A linha foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'A linha não foi deletado'
      );
    }
  }

  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
    });
  }, [refreshKey]);

  const [sectors, setSectors] = useState([{ id: '', sector: '', sequence: '' }]);

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...selectSectors];
    list.splice(index, 1);
    setSelectSector(list);
  };


  const handleRemoveShiftOnClick = (index) => {
    const list = [...selectShifts];
    list.splice(index, 1);
    setSelectShifts(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setSelectSector([...selectSectors, { id: '', sector: '', sequence: '' }]);
  };

  const handleAddShiftClick = () => {
    setSelectShifts([...selectShifts, { productionLineId: '', shiftId: '' }]);
    console.log(selectShifts);
  };

  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  // const [sectorOptions, setSectorOptions] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setName('');
    setId(0);
    setSelectSector([{ id: '', sector: '', sequence: '' }]);
    setSelectShifts([{ productionLineId: '', shiftId: '' }])
    setMaximumProduction('');
    setLastSector(1);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  function HandleChange(value, index) {
    var NewArray = [...selectSectors];

    NewArray[index].sequence = value;
    setSelectSector(NewArray);

    // selectSectors[index].sequence = value
  }

  function HandleShiftChange(value, index) {
    console.log(value);
    var NewArray = [...selectShifts];
    NewArray[index].shiftId = value;
    console.log(NewArray[index].shiftId);

    setSelectShifts(NewArray);

    // selectSectors[index].sequence = value
  }

  function HandleSectorChange(value, index) {
    var NewArray = [...selectSectors];

    NewArray[index].sector = value;
    setSelectSector(NewArray);

    // selectSectors[index].sequence = value
  }

  return (
    <Layout
      style={{
        margin: '24px 16px',
        padding: '21px 24px 24px 24px',
        background: '#fff',
        minHeight: 280,
      }}
    >
      <Row style={{ marginBottom: 16 }}>
        <Col span={24} align="right">
          <Tooltip title="Criar nova linha" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Nova Linha
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de linha de produção"
        visible={show}
        onCancel={handleClose}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            {' '}
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleRegister}>
            {' '}
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={14}>
            <Form.Item
              labelCol={{ span: 23 }}
              label=" Nome da linha:"
              labelAlign={'left'}
            >
              <Input
                name="name"
                placeholder="Exemplo: linha sofá, linha box... "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Capacidade maxima da linha"
              labelAlign={'left'}
            >
              <Input
                name="maximum_production"
                placeholder="Digite o código"
                value={maximumProduction}
                onChange={(e) => setMaximumProduction(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>

          <Col span={24}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Ultimo setor da linha:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={lastSector}
                onChange={(e) => setLastSector(e)}

              // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {sectors.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider></Divider>
        {selectShifts.map((selectShift, index) => {
          return (
            <>
              <Row gutter={5}>
                <Col span={16}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Turno"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={selectShift.shiftId}
                      onChange={(e) => {
                        HandleShiftChange(e, index)
                      }}
                    // filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // eslint-disable-next-line max-len
                    // filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {shift.map((option) => {
                        return (
                          <>
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          </>
                        );
                      })}
                    </Select>

                  </Form.Item>

                </Col>



                <Col>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    style={{ marginTop: 32 }}
                    labelAlign={'left'}
                  >
                    {selectShifts.length !== 1 && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveShiftOnClick(index)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {selectShifts.length - 1 === index && (
                <Button
                  key="primary"
                  title="Nova Linha"
                  style={{ width: '100%', marginBottom: 50 }}
                  onClick={handleAddShiftClick}
                >
                  <PlusOutlined />
                </Button>
              )}
            </>
          );
        })}

        <Divider></Divider>
        {
          selectSectors.map((selectSector, index) => {
            return (
              <>
                <Row></Row>
                <Row gutter={5}>
                  <Col span={16}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="Nome do setor:"
                      labelAlign={'left'}
                    >
                      <Select
                        showSearch
                        placeholder="Selecione"
                        size="large"
                        value={selectSector.sector}
                        onChange={(e) => HandleSectorChange(e, index)}

                      // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                      >
                        {sectors.map((option) => {
                          return (
                            <>
                              <Option key={option.id} value={option.id}>
                                {option.name}
                              </Option>
                            </>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="Ordem:"
                      labelAlign={'left'}
                    >
                      <Input
                        name="sequence"
                        placeholder="Ordem"
                        value={selectSector.sequence}
                        onChange={(e) => HandleChange(e.target.value, index)}
                        style={{ width: '75%', marginRight: 8 }}
                      />
                      {selectSectors.length !== 1 && (
                        <MinusCircleOutlined
                          onClick={() => handleRemoveClick(index)}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                {selectSectors.length - 1 === index && (
                  <Button
                    key="primary"
                    title="Nova Linha"
                    style={{ width: '100%' }}
                    onClick={handleAddClick}
                  >
                    <PlusOutlined />
                  </Button>
                )}
              </>
            );
          })
        }
      </Modal >

      <SearchTable />
    </Layout >
  );
}
