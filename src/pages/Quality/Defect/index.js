import React, { useState, useEffect } from 'react';
import {
    Layout,
    Table,
    Button,
    Row,
    Col,
    Input,
    Space,
    Modal,
    Select,
    Popconfirm,
    notification,
    Form,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { Tooltip } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../services/api';

// import './style.css'
const { Option } = Select;

export default function Defect() {
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
                <SearchOutlined style={{ defect: filtered ? '#1890ff' : undefined }} />
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
                    title: 'Nível',
                    dataIndex: 'level',
                    key: 'level',
                    sorter: (a, b) => this.compareByAlph(a.level, b.level),
                    ...this.getColumnSearchProps('level'),
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

            return <Table columns={columns} dataSource={defect} />;
        }
    }

    const [defect, setDefect] = useState([]);
    const [levelId, setLevelId] = useState(0);
    const [levels, setLevels] = useState([])
    const [levelName, setLevelName] = useState([]);

    const [refreshKey, setRefreshKey] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('defectLevel', {}).then((response) => {
            setLevels(response.data);
        });
    }, [refreshKey]);

    useEffect(() => {
        api.get('defect', {}).then((response) => {
            setDefect(response.data);
        });
    }, [refreshKey]);


    async function handleEdit(e) {
        setId(e.id);
        setName(e.name);
        setLevelName(e.level);
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
            name,
            levelId,
        };
        if (name == '') {
            setError('Este campo deve ser preenchido');
            openNotificationWithIcon(
                'error',
                'O Nível não foi adicionado',
                'O nome não pode ser vazio',

            );
            return;
        }

        try {
            if (id === 0) {
                try {
                    const response = await api.post('defect', data);
                    setRefreshKey((refreshKey) => refreshKey + 1);
                    openNotificationWithIcon(
                        'success',
                        'Criado com sucesso',
                        'O Nível foi criado com sucesso'
                    );
                    handleClose();
                } catch (error) {
                    openNotificationWithIcon(
                        'error',
                        'O Nível não foi adicionado',
                        'Nenhum campo pode ser vazio'
                    );
                }
            } else {
                try {
                    const response = await api.put('defect', data);

                    setRefreshKey((refreshKey) => refreshKey + 1);
                    openNotificationWithIcon(
                        'success',
                        'Alterado com sucesso',
                        'O Nível foi alterado com sucesso'
                    );

                    setId(0);
                    setName('');
                    handleClose();
                } catch (error) {
                    openNotificationWithIcon(
                        'error',
                        'Erro ao editar',
                        'O Nível não foi editado'
                    );
                }
            }
        } catch (error) {
            openNotificationWithIcon(
                'error',
                'Erro ao editar',
                'O Nível não foi editado'
            );
        }
    }

    async function handleDeleteFunction(id) {
        try {
            const response = await api.delete(`quality/${id}`);
            setDefect(defect.filter((defect) => defect.id !== id));
            openNotificationWithIcon(
                'success',
                'Deletado com sucesso',
                'O Nível foi deletado com sucesso'
            );
        } catch (error) {
            openNotificationWithIcon(
                'error',
                'Erro ao deletar',
                'O Nível não foi deletado'
            );
        }
    }

    const [id, setId] = useState(0);
    const [name, setName] = useState('');

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setName('');
        setId(0);
        setLevelId(0);
        setLevelName('');
        setShow(false);
    };
    const handleShow = () => setShow(true);

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
                    <Tooltip title="Criar nível de defeito" placement="right">
                        <Button
                            className="buttonGreen"
                            icon={<PlusOutlined />}
                            style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
                            onClick={handleShow}
                        >
                            Novo de defeito
            </Button>
                    </Tooltip>
                </Col>
            </Row>
            <Modal
                title="Cadastro de Nível de  Defeito"
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
                    <Col span={16}>
                        <Form.Item
                            labelCol={{ span: 23 }}
                            label="Nome do Defeito"
                            labelAlign={'left'}
                        >
                            <Input
                                name="amount"
                                placeholder="Digite o nome do defeito"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                        </Form.Item>
                    </Col>


                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 23 }}
                            label="Nível do Defeito"
                            labelAlign={'left'}
                        >
                            <Select
                                showSearch
                                placeholder="Selecione"
                                size="large"
                                value={levelName}/*product.name*/
                                onChange={(e) => {
                                    setLevelId(e[0]);
                                    setLevelName(e[1]);
                                }} //(e) => HandleChange(e, index)

                            // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                            >
                                {levels.map((option) => {
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

            <SearchTable />
        </Layout>
    );
}


