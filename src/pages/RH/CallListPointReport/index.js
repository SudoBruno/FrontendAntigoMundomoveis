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
    Menu,
    Dropdown,
    Tooltip,
    Checkbox,
    DatePicker,
} from 'antd';
import { CSVLink, CSVDownload } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    UploadOutlined,
    FileExcelOutlined,
    DownloadOutlined,
} from '@ant-design/icons';



import api from '../../../services/api';

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function CallReport() {
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
                    title: 'ID Funcionário',
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
                    title: 'Departamento',
                    dataIndex: 'area',
                    key: 'area',
                    sorter: (a, b) => this.compareByAlph(a.area, b.area),
                    ...this.getColumnSearchProps('area'),
                },
                {
                    title: 'Ponto:',
                    dataIndex: 'passedPoint',
                    key: 'passedPoint',
                    sorter: (a, b) => this.compareByAlph(a.passedPoint, b.passedPoint),
                    ...this.getColumnSearchProps('passedPoint'),
                },
            ];

            return <Table columns={columns} dataSource={input} />;
        }
    }


    const [csvData, setCsvData] = useState([]);
    const [input, setInput] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [ready, setReady] = useState(false);
    const [intervalTime, setIntervalTime] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        api.get('/call/employee/inputPresencePointFilter', {}).then((response) => {
            setInput(response.data);
            console.log(input);
        });
    }, [refreshKey]);


    async function Filter() {
        const data = {
            intervalTime: intervalTime,
        };
        const response = await api.post('/call/employee/presencePointFilter', data);

        setInput(response.data);
    }

    async function Input() {
        setReady(false);


        const data = {
            intervalTime: intervalTime,
        };

        let response = [];
        if (intervalTime.length == 0) {
            response = await api.get('/call/employee/presencePointFilter')
        } else {
            response = await api.post('/call/employee/presencePointFilter', data)
        }

        setCsvData(response.data);
        setTimeout(
            function () {
                setReady(true);
            }.bind(this),
            500
        );
        setHeaders([
            { label: 'ID da Chamada', key: 'id' },
            { label: 'ID do Funcionário', key: 'employeeId' },
            { label: 'Departamento', key: 'area' },
            { label: 'Ponto', key: 'passedPoint' },
        ]);
    }
    function openNotificationWithIcon(type, message, description) {
        notification[type]({
            message: message,
            description: description,
        });
    }


    const [error, setError] = useState('');

    function openNotificationWithIcon(type, message, description) {
        notification[type]({
            message: message,
            description: description,
        });
    }

    const csvReport = {
        data: csvData,
        headers: headers,
        filename: 'relatorioDePonto.csv',
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

            <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <RangePicker
                        size="small"
                        placeholder={['data inicial', 'data final']}
                        onChange={setIntervalTime}
                    />
                    <SearchOutlined
                        style={{
                            fontSize: 18,
                            color: '#3b4357',
                            marginLeft: 8,
                        }}
                        onClick={Filter}
                    />
                </Col>
                <Col span={12} align="end">
                    {!ready && (
                        <Button type="submit" className="buttonGreen" onClick={Input}>
                            <FileExcelOutlined style={{ marginRight: 8 }} />
                Relatório de Ponto
                        </Button>
                    )}
                    {ready && (
                        <Button className="buttonGreen">
                            <DownloadOutlined style={{ marginRight: 8 }} />
                            <CSVLink {...csvReport} data={csvData} style={{ color: '#fff' }} separator={';'}>
                                Download
                </CSVLink>
                        </Button>
                    )}
                </Col>
            </Row>
            <SearchTable />
        </Layout>
    );
    // return (
    //   <>
    //     <div className="call-list-buttons">

    //       <label for='employeeList' className="input-file">Selecionar um arquivo &#187;</label>
    //       <input type="file" id='employeeList' onChange={(e) => handleUpload(e)} />

    //       <button className="btn-enviar" onClick={Send}>Enviar</button>

    //     </div>

    //   </>

    // );
}