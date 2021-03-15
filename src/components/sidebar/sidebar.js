import React from 'react';
import 'antd/dist/antd.css';
import { Route, Link, Redirect } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import {
  RightSquareOutlined,
  DashboardOutlined,
  PlusOutlined,
  ExportOutlined,
  ShoppingCartOutlined,
  BarcodeOutlined,
  FileExcelOutlined,
  UserOutlined,
  SearchOutlined,
  SignalFilled,
} from '@ant-design/icons';
import { FaCouch, FaWarehouse } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { BsListCheck } from 'react-icons/bs';

import logo from '../../assets/logo.png';
import Cookies from 'js-cookie';

//////////////////////////////////////////////////////////////////
//REGISTER
import Profile from '../../pages/Profile';
import PCP from '../../pages/PCP';

import FactorySector from '../../pages/RH/FactorySector';
import ProductionLine from '../../pages/ProductionLine';
import SubProduct from '../../pages/SubProduct';
import Colors from '../../pages/ProductColor';
import Product from '../../pages/Product';
import Client from '../../pages/Client';

//REGISTER
//////////////////////////////////////////////////////////////////
import ExpeditionWarehouse from '../../pages/Expedition/Warehouse';
import ExpeditionStreet from '../../pages/Expedition/Street';
import ExpeditionInput from '../../pages/Expedition/Input';
import ExpeditionOutput from '../../pages/Expedition/Output';
import ExpeditionStock from '../../pages/Expedition/Stock';
import ExpeditionLaunch from '../../pages/Expedition/Launch';
import ExpeditionChange from '../../pages/Expedition/Change';
import ExpeditionDrop from '../../pages/Expedition/Search/Drop';

import ExpeditionInputDefect from '../../pages/Expedition/Input/defect';
import ExpeditionOutputDefect from '../../pages/Expedition/Output/defect';
import ExpeditionStockDefect from '../../pages/Expedition/Stock/defect';

//////////////////////////////////////////////////////////////////
//WMS - RAW MATERIAL
import WmsRawSupplier from '../../pages/WmsRawMaterial/Register/Supplier';
import WmsRawUnMeasure from '../../pages/WmsRawMaterial/Register/UnMeasure';
import WmsRawWarehouse from '../../pages/WmsRawMaterial/Register/Warehouse';
import WmsRawPosition from '../../pages/WmsRawMaterial/Register/Position';
import WmsRawMaterial from '../../pages/WmsRawMaterial/Register/RawMaterial';

import WmsRawEntry from '../../pages/WmsRawMaterial/Operation/Entry';
import WmsRawExit from '../../pages/WmsRawMaterial/Operation/Exit';
import WmsRawStorage from '../../pages/WmsRawMaterial/Operation/Storage';

import WmsRawSearchStorage from '../../pages/WmsRawMaterial/Search/SearchStorage';
import WmsRawMaterialSearchEntry from '../../pages/WmsRawMaterial/Search/SearchEntry';
import WmsRawResumeExit from '../../pages/WmsRawMaterial/Search/ResumeExit';
import WmsRawMaterialPCP from '../../pages/WmsRawMaterial/Search/PCP';

//WMS - RAW MATERIAL
//////////////////////////////////////////////////////////////////

////////////////////// RH ////////////////////////
import Shift from '../../pages/RH/Shift';
import FactoryArea from '../../pages/RH/FactoryArea';
import FactoryFunction from '../../pages/RH/FactoryFunction';
import Company from '../../pages/RH/Company';
import Employee from '../../pages/RH/Employee';
import Drop from '../../pages/Drop';
import ProductionReport from '../../pages/ProductionReport';
import NotProductionReport from '../../pages/NotProductionReport';

import './style.css';
import CoverLaunch from '../../pages/Cover/Launch';
import CoverStock from '../../pages/Cover/Search/Stock';
import SingleCoverStock from '../../pages/Cover/Search/SingleCoverStock';
import CoverInput from '../../pages/Cover/Search/Input';
import CoverOutput from '../../pages/Cover/Search/Output';
import CoverWarehouse from '../../pages/Cover/Register/Warehouse';
import CoverStreet from '../../pages/Cover/Register/Street';

import CallList from '../../pages/RH/CallList';
import CallReport from '../..//pages/RH/CallReport';
import CallReportPoint from '../../pages/RH/CallListPointReport';
import PlantingMount from '../../pages/Planting/Mount';
import Seccionadora from '../../pages/Planting/Mount/seccionadora';
import PlantingReportStockMount from '../../pages/Planting/Search/MountStock';
import PlantingDayProductionMount from '../../pages/Planting/Search/DayProductionMount';
import PlantingDayDefectMount from '../../pages/Planting/Search/DayDefectMount';
import PlantingInputMount from '../../pages/Planting/Stock/input';
import PlantingOutputMount from '../../pages/Planting/Stock/output';
import PlantingDefect from '../../pages/Planting/Defect';
import PlantingWarehouse from '../../pages/Planting/Warehouse';
import PlantingStreet from '../../pages/Planting/Street';
import DefectLevel from '../../pages/Quality/DefectLevel/index';
import Defect from '../../pages/Quality/Defect/index';
import CallListTransferEmployee from '../../pages/RH/CallListTransferEmployee/';
import DefectReport from '../../pages/Quality/DefectReport';

const userName = localStorage.getItem('userName');

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const routes = [
  {
    path: '/pcp',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PCP />,
  },
  {
    path: '/factory-sector',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <FactorySector />,
  },
  {
    path: '/production-line',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ProductionLine />,
  },
  {
    path: '/sub-product',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <SubProduct />,
  },
  {
    path: '/color',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Colors />,
  },
  {
    path: '/product',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Product />,
  },
  {
    path: '/client',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Client />,
  },

  //WMS RAW MATERIAL
  {
    path: '/wmsRawSupplier',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawSupplier />,
  },
  {
    path: '/wmsRawUnMeasure',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawUnMeasure />,
  },
  {
    path: '/wmsRawWarehouse',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawWarehouse />,
  },
  {
    path: '/wmsRawPosition',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawPosition />,
  },
  {
    path: '/wmsRawMaterial',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawMaterial />,
  },
  {
    path: '/wmsRawEntry',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawEntry />,
  },
  {
    path: '/wmsRawExit',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawExit />,
  },
  {
    path: '/wmsRawStorage',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawStorage />,
  },
  {
    path: '/wmsRawStorage/Search',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawSearchStorage />,
  },

  {
    path: '/wmsRawExit/Resume',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawResumeExit />,
  },
  //WMS RAW MATERIAL
  {
    path: '/profile',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Profile />,
  },

  //WMS RAW MATERIAL

  //WMS RAW MATERIAL
  //Expedição
  {
    path: '/expedition/warehouse',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionWarehouse />,
  },
  {
    path: '/expedition/street',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionStreet />,
  },
  {
    path: '/expedition/input',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionInput />,
  },
  {
    path: '/expedition/output',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionOutput />,
  },
  {
    path: '/expedition/stock',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionStock />,
  },
  {
    path: '/expedition/launch',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionLaunch />,
  },

  {
    path: '/expedition/change',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionChange />,
  },
  {
    path: '/expedition/drop',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionDrop />,
  },
  {
    path: '/expedition/input/defect',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionInputDefect />,
  },
  {
    path: '/expedition/output/defect',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionOutputDefect />,
  },
  {
    path: '/expedition/stock/defect',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ExpeditionStockDefect />,
  },
  //////////////// RH  //////////////////////
  {
    path: '/shift',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Shift />,
  },
  {
    path: '/company',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Company />,
  },
  {
    path: '/factory/sector',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <FactorySector />,
  },
  {
    path: '/factory/area',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <FactoryArea />,
  },
  {
    path: '/factory/function',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <FactoryFunction />,
  },
  {
    path: '/employee',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Employee />,
  },
  {
    path: '/drop',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Drop />,
  },
  {
    path: '/production/report',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <ProductionReport />,
  },
  {
    path: '/not/production/report',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <NotProductionReport />,
  },
  {
    path: '/wmsRawMaterial/Search/entry',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawMaterialSearchEntry />,
  },
  {
    path: '/wmsRawMaterial/pcp',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <WmsRawMaterialPCP />,
  },
  {
    path: '/cover/launch',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CoverLaunch />,
  },
  {
    path: '/cover/stock',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CoverStock />,
  },
  {
    path: '/single/cover/stock',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <SingleCoverStock />,
  },

  {
    path: '/cover/input',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CoverInput />,
  },
  {
    path: '/cover/output',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CoverOutput />,
  },
  {
    path: '/cover/warehouse',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CoverWarehouse />,
  },
  {
    path: '/cover/street',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CoverStreet />,
  },
  {
    path: '/call/employee',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CallList />,
  },
  {
    path: '/call/report',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CallReport />,
  },
  {
    path: '/call/reportPoint',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CallReportPoint />,
  },
  {
    path: '/call/transferReport',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <CallListTransferEmployee />,
  },
  {
    path: '/mount',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingMount />,
  },
  {
    path: '/report/stock/mount',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingReportStockMount />,
  },
  {
    path: '/plating/mount/stock',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingInputMount />,
  },
  {
    path: '/plating/mount/output/stock',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingOutputMount />,
  },

  {
    path: '/plating/defect',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingDefect />,
  },
  {
    path: '/plating/warehouse',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingWarehouse />,
  },
  {
    path: '/plating/street',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingStreet />,
  },

  {
    path: '/day/production/mount',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingDayProductionMount />,
  },
  {
    path: '/day/defect/mount',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <PlantingDayDefectMount />,
  },

  {
    path: '/seccionadora/mount',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Seccionadora />,
  },
  {
    path: '/quality/defectLevel',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <DefectLevel />,
  },
  {
    path: '/quality/defect',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Defect />,
  },
  {
    path: '/quality/defectReport',
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <DefectReport />,
  },
];

class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const isAuthenticated =
      (localStorage.getItem('userId') !== null &&
        Cookies.get('token') !== undefined &&
        localStorage.getItem('access_level') === '1') ||
      localStorage.getItem('access_level') === '4' ||
      localStorage.getItem('access_level') === '5' ||
      localStorage.getItem('access_level') === '7';

    if (!isAuthenticated) {
      return <Redirect to="/" />;
    }

    function handleLogout(e) {
      localStorage.clear();
      Cookies.remove('token');

      return <Redirect to="/" />;
    }

    return (
      <div>
        <Layout style={{ height: '100%' }}></Layout>
        <Sider
          trigger={null}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
          collapsible
          collapsed={this.state.collapsed}
        >
          {localStorage.getItem('access_level') === '1' && (
            <div
              className="logo"
              style={{ textAlign: 'center', paddingTop: '0.48rem' }}
            >
              Painel Administrativo
            </div>
          )}
          {localStorage.getItem('access_level') === '4' && (
            <div
              className="logo"
              style={{ textAlign: 'center', paddingTop: '0.48rem' }}
            >
              Painel Almoxarifado
            </div>
          )}

          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {localStorage.getItem('access_level') === '1' && (
              <Menu.Item key="1" icon={<DashboardOutlined />}>
                <Link to="/profile">Dashboard</Link>
              </Menu.Item>
            )}
            {localStorage.getItem('access_level') === '1' && (
              <SubMenu
                key="2"
                title="PCP"
                icon={
                  <span className="anticon anticon-bank">
                    <FaCouch color="#fff" size={16} />
                  </span>
                }
              >
                <Menu.Item key="31" icon={<PlusOutlined />}>
                  <Link to="/pcp">Produção</Link>
                </Menu.Item>
                <SubMenu
                  key="pcpReport"
                  title="Relatórios"
                  icon={<RightSquareOutlined />}
                >
                  <Menu.Item
                    key="productionReport"
                    icon={<FileExcelOutlined />}
                  >
                    <Link to="/production/report">Produzidos </Link>
                  </Menu.Item>
                  <Menu.Item
                    key="notProductionReport"
                    icon={<FileExcelOutlined />}
                  >
                    <Link to="/not/production/report">Não Produzidos </Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            )}
            {localStorage.getItem('access_level') === '1' && (
              <SubMenu
                key="pcpCadastros"
                title="Cadastros"
                icon={<PlusOutlined />}
              >
                <Menu.Item key="productionLine" icon={<RightSquareOutlined />}>
                  <Link to="/production-line">Linha de Produção</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<RightSquareOutlined />}>
                  <Link to="/sub-product">Subproduto</Link>
                </Menu.Item>

                <Menu.Item key="8" icon={<RightSquareOutlined />}>
                  <Link to="/color">Cores</Link>
                </Menu.Item>

                <Menu.Item key="9" icon={<RightSquareOutlined />}>
                  <Link to="/client">Clientes</Link>
                </Menu.Item>

                <Menu.Item key="10" icon={<RightSquareOutlined />}>
                  <Link to="/product">Produtos</Link>
                </Menu.Item>
              </SubMenu>
            )}
            {(localStorage.getItem('access_level') === '4' ||
              localStorage.getItem('access_level') === '1') && (
                <SubMenu
                  key="WnsInsumos"
                  title="Almoxarifado"
                  icon={
                    <span className="anticon anticon-bank">
                      <FiPackage size={16} color="#fff" />
                    </span>
                  }
                >
                  {localStorage.getItem('access_level') === '1' && (
                    <SubMenu
                      key="WnsInsumosCadastros"
                      title="Cadastros"
                      icon={<PlusOutlined />}
                    >
                      <Menu.Item key="11" icon={<RightSquareOutlined />}>
                        <Link to="/wmsRawWarehouse">Almoxarifados</Link>
                      </Menu.Item>

                      <Menu.Item key="12" icon={<RightSquareOutlined />}>
                        <Link to="/wmsRawSupplier">Fornecedores</Link>
                      </Menu.Item>

                      <Menu.Item key="15" icon={<RightSquareOutlined />}>
                        <Link to="/wmsRawUnMeasure">Un. Medidas</Link>
                      </Menu.Item>

                      <Menu.Item key="13" icon={<RightSquareOutlined />}>
                        <Link to="/wmsRawMaterial">Insumos</Link>
                      </Menu.Item>

                      <Menu.Item key="14" icon={<RightSquareOutlined />}>
                        <Link to="/wmsRawPosition">Posições</Link>
                      </Menu.Item>
                    </SubMenu>
                  )}

                  {(localStorage.getItem('access_level') === '4' ||
                    localStorage.getItem('access_level') === '1') && (
                      <SubMenu
                        key="WnsInsumosOperacao"
                        title="Operações"
                        icon={<ShoppingCartOutlined />}
                      >
                        <Menu.Item key="16" icon={<RightSquareOutlined />}>
                          <Link to="/wmsRawEntry">Entradas</Link>
                        </Menu.Item>

                        <Menu.Item key="17" icon={<RightSquareOutlined />}>
                          <Link to="/wmsRawStorage">Armazenagens</Link>
                        </Menu.Item>

                        <Menu.Item key="18" icon={<RightSquareOutlined />}>
                          <Link to="/wmsRawExit">Saídas</Link>
                        </Menu.Item>
                      </SubMenu>
                    )}

                  <SubMenu
                    key="WnsInsumosSearches"
                    title="Consultas"
                    icon={<SearchOutlined />}
                  >
                    <Menu.Item key="19" icon={<FileExcelOutlined />}>
                      <Link to="/wmsRawStorage/Search">Estoque</Link>
                    </Menu.Item>

                    <Menu.Item key="21" icon={<FileExcelOutlined />}>
                      <Link to="/wmsRawExit/Resume">Rel. Saídas</Link>
                    </Menu.Item>
                    <Menu.Item key="32" icon={<FileExcelOutlined />}>
                      <Link to="/wmsRawMaterial/Search/entry">Rel. entrada</Link>
                    </Menu.Item>

                    <Menu.Item key="33" icon={<FileExcelOutlined />}>
                      <Link to="/wmsRawMaterial/pcp">PCP's</Link>
                    </Menu.Item>
                  </SubMenu>
                </SubMenu>
              )}

            {localStorage.getItem('access_level') === '1' && (
              <SubMenu
                key="expedition"
                title="Expedição"
                icon={
                  <span className="anticon anticon-bank">
                    <FaWarehouse size={16} color="#fff" />
                  </span>
                }
              >
                <SubMenu
                  key="expeditionCadastro"
                  title="Cadastros"
                  icon={<PlusOutlined />}
                >
                  <Menu.Item key="22" icon={<RightSquareOutlined />}>
                    <Link to="/expedition/warehouse">Almoxarifado</Link>
                  </Menu.Item>
                  <Menu.Item key="23" icon={<RightSquareOutlined />}>
                    <Link to="/expedition/street">Rua</Link>
                  </Menu.Item>
                  <Menu.Item key="31" icon={<RightSquareOutlined />}>
                    <Link to="/drop">Agenda do Drop</Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="24" icon={<BarcodeOutlined />}>
                  <Link to="/expedition/launch">Lançamento</Link>
                </Menu.Item>
                <SubMenu
                  key="ExpeditionSearches"
                  title="Consultas"
                  icon={<SearchOutlined />}
                >
                  <Menu.Item key="25" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/stock">Estoque</Link>
                  </Menu.Item>

                  <Menu.Item key="36" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/input">Entradas</Link>
                  </Menu.Item>

                  <Menu.Item key="34" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/output">Saídas</Link>
                  </Menu.Item>
                  <Menu.Item key="35" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/change">Troca de estoque</Link>
                  </Menu.Item>
                  <Menu.Item key="41" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/drop">Drop</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key="ExpeditionDefectSearches"
                  title="PD"
                  icon={<SearchOutlined />}
                >
                  <Menu.Item key="stockDefect" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/stock/defect">Estoque</Link>
                  </Menu.Item>

                  <Menu.Item key="inputDefect" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/input/defect">Entradas</Link>
                  </Menu.Item>

                  <Menu.Item key="outputDefect" icon={<FileExcelOutlined />}>
                    <Link to="/expedition/output/defect">Saídas</Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            )}

            {localStorage.getItem('access_level') === '1' && (
              <SubMenu
                key="quality"
                title="Qualidade"
                icon={<SignalFilled e size={16} color="#fff" />}
              >
                <SubMenu
                  key="defectLevelInsert"
                  title="Cadastros"
                  icon={<PlusOutlined />}
                >
                  <Menu.Item key="4" icon={<RightSquareOutlined />}>
                    <Link to="/quality/defectLevel">Nível de Defeito</Link>
                  </Menu.Item>

                  <Menu.Item key="3" icon={<RightSquareOutlined />}>
                    <Link to="/quality/defect">Defeito</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key="defectReport"
                  title="Relatórios"
                  icon={<FileExcelOutlined />}

                >
                  <Menu.Item key="defectReportItem" icon={<RightSquareOutlined />}>
                    <Link to="/quality/defectReport">Defeitos</Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            )}
            {localStorage.getItem('access_level') === '1' && (
              <SubMenu key="rh" title="RH" icon={<UserOutlined />}>
                <SubMenu
                  key="RhCadastros"
                  title="Cadastros"
                  icon={<PlusOutlined />}
                >
                  <Menu.Item key="shift" icon={<RightSquareOutlined />}>
                    <Link to="/shift">Turno </Link>
                  </Menu.Item>
                  <Menu.Item key="26" icon={<RightSquareOutlined />}>
                    <Link to="/company">Empresa</Link>
                  </Menu.Item>

                  <Menu.Item key="27" icon={<RightSquareOutlined />}>
                    <Link to="/factory/sector">Setor </Link>
                  </Menu.Item>
                  <Menu.Item key="28" icon={<RightSquareOutlined />}>
                    <Link to="/factory/area">Area </Link>
                  </Menu.Item>
                  <Menu.Item key="29" icon={<RightSquareOutlined />}>
                    <Link to="/factory/function">Função </Link>
                  </Menu.Item>
                  <Menu.Item key="30" icon={<RightSquareOutlined />}>
                    <Link to="/employee">Funcionário </Link>
                  </Menu.Item>
                </SubMenu>

                <Menu.Item
                  key="32"
                  icon={
                    <span className="anticon anticon-bank">
                      <BsListCheck color="#fff" size={16} />
                    </span>
                  }
                >
                  <Link to="/call/employee">Chamada </Link>
                </Menu.Item>
                <SubMenu
                  key="ResportCallList"
                  title="Relatórios"
                  icon={<SearchOutlined />}
                >
                  <Menu.Item
                    key="reportFault"
                    icon={
                      <span className="anticon anticon-bank">
                        <FileExcelOutlined color="#fff" size={16} />
                      </span>
                    }
                  >
                    <Link to="/call/report">Falta</Link>
                  </Menu.Item>

                  <Menu.Item
                    key="ReportPoint"
                    icon={
                      <span className="anticon anticon-bank">
                        <FileExcelOutlined color="#fff" size={16} />
                      </span>
                    }
                  >
                    <Link to="/call/reportPoint">Ponto</Link>
                  </Menu.Item>

                  <Menu.Item
                    key="transferReport"
                    icon={
                      <span className="anticon anticon-bank">
                        <FileExcelOutlined color="#fff" size={16} />
                      </span>
                    }
                  >
                    <Link to="/call/transferReport">Movimentação</Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            )}

            {(localStorage.getItem('access_level') === '1' ||
              localStorage.getItem('access_level') === '5') && (
                <SubMenu
                  key="cover"
                  title="Controle de capas"
                  icon={<RightSquareOutlined />}
                >
                  {localStorage.getItem('access_level') === '1' && (
                    <SubMenu
                      key="registerCover"
                      title="Cadastros"
                      icon={<PlusOutlined />}
                    >
                      <Menu.Item key="7" icon={<RightSquareOutlined />}>
                        <Link to="/sub-product">Subproduto</Link>
                      </Menu.Item>
                      <Menu.Item key="stockCover" icon={<RightSquareOutlined />}>
                        <Link to="/cover/warehouse">Estoques</Link>
                      </Menu.Item>
                      <Menu.Item key="streetCover" icon={<RightSquareOutlined />}>
                        <Link to="/cover/street">Rua</Link>
                      </Menu.Item>
                    </SubMenu>
                  )}

                  {(localStorage.getItem('access_level') === '1' ||
                    localStorage.getItem('access_level') === '5') && (
                      <Menu.Item key="37" icon={<BarcodeOutlined />}>
                        <Link to="/cover/launch">Lançamento</Link>
                      </Menu.Item>
                    )}
                  {(localStorage.getItem('access_level') === '1' ||
                    localStorage.getItem('access_level') === '5') && (
                      <SubMenu
                        key="ExpeditionSearches"
                        title="Consultas"
                        icon={<SearchOutlined />}
                      >
                        <Menu.Item
                          key="singleCoverStock"
                          icon={<FileExcelOutlined />}
                        >
                          <Link to="/single/cover/stock">Capas</Link>
                        </Menu.Item>
                        <Menu.Item key="38" icon={<FileExcelOutlined />}>
                          <Link to="/cover/stock">Estoque</Link>
                        </Menu.Item>
                        <Menu.Item key="coverInput" icon={<FileExcelOutlined />}>
                          <Link to="/cover/input">Entrada</Link>
                        </Menu.Item>
                        <Menu.Item key="coverOutput" icon={<FileExcelOutlined />}>
                          <Link to="/cover/output">Saida</Link>
                        </Menu.Item>
                      </SubMenu>
                    )}
                </SubMenu>
              )}

            {(localStorage.getItem('access_level') === '1' ||
              localStorage.getItem('access_level') === '7') && (
                <SubMenu key="planting" title="Chaparia" icon={<UserOutlined />}>
                  <Menu.Item
                    key="mountSeccionadora"
                    icon={<RightSquareOutlined />}
                  >
                    <Link to="/seccionadora/mount">Seccionadora </Link>
                  </Menu.Item>
                  <Menu.Item key="planting1" icon={<RightSquareOutlined />}>
                    <Link to="/mount">Linha</Link>
                  </Menu.Item>
                  <Menu.Item
                    key="platingStockMount"
                    icon={<RightSquareOutlined />}
                  >
                    <Link to="/plating/mount/stock">Estoque montes</Link>
                  </Menu.Item>
                  <Menu.Item
                    key="platingOutputStockMount"
                    icon={<RightSquareOutlined />}
                  >
                    <Link to="/plating/mount/output/stock">
                      Remover do estoque de montes
                  </Link>
                  </Menu.Item>

                  {localStorage.getItem('access_level') === '1' && (
                    <SubMenu
                      key="platingSearches"
                      title="Consultas"
                      icon={<SearchOutlined />}
                    >
                      {/* <Menu.Item key="mountStock" icon={<RightSquareOutlined />}>
                    <Link to="/stock/mount">Na Linha</Link>
                  </Menu.Item> */}
                      <Menu.Item
                        key="mountProduction"
                        icon={<RightSquareOutlined />}
                      >
                        <Link to="/day/production/mount">produzido</Link>
                      </Menu.Item>
                      <Menu.Item key="mountDefect" icon={<RightSquareOutlined />}>
                        <Link to="/day/defect/mount">Defeitos</Link>
                      </Menu.Item>
                    </SubMenu>
                  )}
                  {localStorage.getItem('access_level') === '1' && (
                    <SubMenu
                      key="platingCad"
                      title="Cadastros"
                      icon={<PlusOutlined />}
                    >
                      <Menu.Item
                        key="platingDefect"
                        icon={<RightSquareOutlined />}
                      >
                        <Link to="/plating/defect">Defeitos</Link>
                      </Menu.Item>
                      <Menu.Item
                        key="platingWarehouse"
                        icon={<RightSquareOutlined />}
                      >
                        <Link to="/plating/warehouse">Armazém</Link>
                      </Menu.Item>
                      <Menu.Item
                        key="platingStreet"
                        icon={<RightSquareOutlined />}
                      >
                        <Link to="/plating/street">Rua</Link>
                      </Menu.Item>
                    </SubMenu>
                  )}
                </SubMenu>
              )}
            <Menu.Item key="40" icon={<ExportOutlined />}>
              <Link to="/" onClick={handleLogout}>
                Sair
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header
            className="site-layout-background"
            style={{ paddingTop: 20, background: '#f0f0f5', height: 100 }}
          >
            <img src={logo} alt="Mundo moveis" />
            <span className="UserName">Bem vindo(a), {userName}</span>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              minHeight: 500,
            }}
          >
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
