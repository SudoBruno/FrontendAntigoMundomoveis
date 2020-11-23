import React, { useState, useEffect } from 'react';
import {
  BarcodeOutlined,
  SearchOutlined,
  CheckOutlined,
  DeleteOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { Tooltip } from '@material-ui/core/';
import BarcodeReader from 'react-barcode-reader';

import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Popconfirm,
  Space,
  Divider,
  Modal,
  notification,
  Form,
} from 'antd';

import api from '../../../../../services/api';
import Highlighter from 'react-highlight-words';


export default function BarcodeLaunch() {


  //#region States and variables

  const [show, setShow] = useState(false);

  const [launchQtd, setLaunchQtd] = useState(0);

  const user = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');

  const [errorDescription, setErrorDescription] = useState('');

  const [description, setDescription] = useState('');
  const [id_user, setIdUser] = useState(userId + ' - ' + user);
  const [exits, setExits] = useState([]);


  //#endregion


  //#region Methods

  const handleClose = () => {
    setShow(false);
    setDescription('');
    setExits([]);
    setLaunchQtd(0);
  };

  const handleShow = () => {
    setShow(true);
  };


  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const BarcodeScan = (e) => {
    findBarcode(e);
  }

  const findBarcode = async (e) => {
    try {

      //Verify with barcode has been lauched
      let status = false;
      let statusFullExit = false;

      exits.map((item) => {
        if (item.barcode === e) {//If true has been launch
          status = true;
        }
      });
      //Verify with barcode has been lauched

      if (status === false) {

        const data = {
          barcode: e
        }

        const response = await api.post('/wmsrm/operation/exit/barcode', data);

        if (response.data === null || response.data === '' || response.data.length === 0) {

          openNotificationWithIcon(
            'error',
            'Erro',
            'Código de barras não encontrado'
          );

        }
        else {

          let newArr = [...exits];

          response.data.map((item) => {

            if (item.quantity_storage === item.quantity_exit) {
              statusFullExit = true;
            }

            if (statusFullExit === false) {

              newArr.push({
                id: item.id,
                id_storageitens: item.id_storageitens,
                quantity: 0,
                quantity_storage: item.quantity_storage,
                quantity_exit: item.quantity_exit,
                quantity_rest: item.quantity_rest,
                id_warehouse: item.id_warehouse,
                id_rawmaterial: item.id_rawmaterial,
                name_rawmaterial: item.name_rawmaterial,
                ins: item.ins,
                description: item.description,
                unity: item.unity,
                warehouse_name: item.warehouse_name,
                position_name: item.position_name,
                local: item.local,
                created_at: item.created_at,
                barcode: item.barcode
              });
            }
            else {
              openNotificationWithIcon(
                'error',
                'Erro',
                'Não existe saídas para esse item'
              );
            }
          });

          if (statusFullExit === false) {
            setLaunchQtd(launchQtd => launchQtd + 1);
            setExits(newArr);

            openNotificationWithIcon(
              'success',
              'Lançado com sucesso',
              'Código lançado com sucesso'
            );
          }
        }

      }
      else {
        openNotificationWithIcon(
          'error',
          'Erro no lançamento',
          'Código de barras já lançado'
        );
      }
    }
    catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro',
        'Erro ao lançar insumo, tente novamente'
      );
    }
  }


  const HandleChangeQuantity = (value, index) => {

    var NewArray = [...exits];
    NewArray[index].quantity = value;
    NewArray[index].errorQuantity = '';

    let quantityStorage = NewArray[index].quantity_storage;
    let quantityExit = NewArray[index].quantity_exit;

    //Routine - verify on screen if exits a storage with same item to sum total
    let arrCompare = [...exits];
    let sum = 0;

    arrCompare.map((item) => {
      if (NewArray[index].id_storageitens === item.id_storageitens) {
        sum += parseFloat(item.quantity);
      }
    });

    //Routine - verify on screen if exits a storage with same item to sum total

    ///Validation of values, exit can't be higher than storage
    let result = quantityStorage - quantityExit - sum;

    if (result < 0) {
      NewArray[index].quantity = 0;

      openNotificationWithIcon(
        'error',
        'Erro na quantidade escolhida',
        'Valor maior do que a armazenagem'
      );
      NewArray[index].errorQuantity = 'Valor inválido';
    }
    else {
      NewArray[index].quantity_rest = result;
      NewArray[index].errorQuantity = '';
    }
    ///Validation of values, exit can't be higher than storage

    setExits(NewArray);
  }

  async function handleRegister(e) {
    e.preventDefault();

    const idUserLogged = id_user.split('-')[0];

    const data = {
      description,
      id_user: idUserLogged,
      exits,
    };

    //Validations
    let countErrors = 0;

    if (description == '') {
      setErrorDescription('Este campo deve ser preenchido');
      countErrors++;
    }

    let NewArray = [...exits];

    exits.map((item, index) => {

      if (parseFloat(item.quantity) === 0.0 || item.quantity === '') {
        countErrors++;
        NewArray[index].errorQuantity = 'Quantidade inválida';
      }
    });

    setExits(NewArray);
    //Validations
    if (countErrors === 0) {
      try {
        try {
          await api.post('/wmsrm/operation/exit', data);

          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'a saída foi criada com sucesso'
          );
          handleClose();
        }
        catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'a saída não foi adicionada'
          );
        }
      }
      catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao editar',
          'A saída não foi editada'
        );
      }
    }

    window.location.reload();
  }

  const handleRemoveClick = (index) => {
    const list = [...exits];
    list.splice(index, 1);

    setLaunchQtd((launchQtd) => launchQtd - 1);
    setExits(list);
  };


  //#endregion

  return (
    <>
      <div>

        <Tooltip title="Saída por código de barras" placement="top">
          <Button
            className="buttonBlue"
            icon={<BarcodeOutlined />}
            style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
            onClick={handleShow}
          > Saída por código de barras
            </Button>
        </Tooltip>
      </div>

      <Modal
        title="Saída de Insumos por código de barras"
        visible={show}
        width={900}
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
        <Row gutter={24}>
          <Col span={10}>
            <label>
              {' '}
                    Nome do PCP de saída:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
              <Input
                name="description"
                placeholder="Digite o nome do PCP"
                onChange={(e) => { setDescription(e.target.value); setErrorDescription(''); }}
                value={description}
                style={{ marginTop: 10 }}
              />
              <span style={{ color: 'red', marginBottom: 10 }}>{errorDescription}</span>
            </label>
          </Col>

          <Col span={8}>
            <label>
              {' '}
                    Usuário:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
              <Input
                disabled={true}
                name="user"
                value={id_user}
                style={{ marginTop: 10 }}
              />
            </label>
          </Col>

          <Col span={6} align="center">
            <label>
              {' '}
              <h4>Lançados:</h4>
              <h1>{launchQtd}</h1>
            </label>
          </Col>


        </Row>

        <Divider />

        {launchQtd === 0 &&
          <Row>
            <Col span={24} align='center'>
              <h3>Aguardando leitura do código de barras...</h3>
            </Col>
          </Row>
        }

        {exits.map((selectExit, index) => {
          return (
            <>
              <Row gutter={24} style={{ marginBottom: 10 }}>
                <Col span={10}>
                  <label>
                    {' '}
                    Almoxarifado:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
                    <Input
                      disabled={true}
                      name="warehouse"
                      value={selectExit.warehouse_name}
                      style={{ width: '95%', marginRight: '5%', marginTop: 10 }}
                    />

                  </label>
                </Col>

                <Col span={6}>
                  <label>
                    {' '}
                    Posição:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
                    <Input
                      disabled={true}
                      name="position"
                      value={selectExit.position_name}
                      style={{ width: '95%', marginRight: '5%', marginTop: 10 }}
                    />
                  </label>
                </Col>

                <Col span={8}>
                  <label>
                    {' '}
                    Código de barras:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
                    <Input
                      disabled={true}
                      name="barcode"
                      value={selectExit.barcode}
                      style={{ width: '95%', marginRight: '5%', marginTop: 10 }}
                    />
                  </label>
                </Col>

              </Row>


              <Row>
                <Col span={12}>
                  <label>
                    {' '}
                    Insumo:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
                    <Input
                      disabled={true}
                      name="description"
                      value={selectExit.description}
                      style={{ width: '95%', marginRight: '5%', marginTop: 10 }}
                    />
                  </label>

                </Col>

                <Col span={3}>
                  <label>
                    {' '}
                    Qtd Saída:<span style={{ color: 'red', marginTop: 10, marginBottom: 10 }}> * </span>
                    <Input
                      name="quantity"
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.01"
                      value={selectExit.quantity}
                      onChange={(e) => HandleChangeQuantity(e.target.value, index)}
                      style={{ width: '85%', marginRight: '5%', marginTop: 10 }}
                    />

                  </label>
                  <span style={{ color: 'red', marginBottom: 10 }}>{selectExit.errorQuantity}</span>
                </Col>

                <Col span={3}>
                  <label>
                    {' '}
                    Qtd Armaz.:
                    <Input
                      name="storageQuantity"
                      disabled={true}
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.001"
                      value={selectExit.quantity_storage}
                      style={{ width: '85%', marginRight: '5%', marginTop: 10 }}
                    />
                  </label>
                </Col>

                <Col span={3}>
                  <label>
                    {' '}
                    Qtd Saída:
                    <Input
                      name="exitQuantity"
                      disabled={true}
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.001"
                      value={selectExit.quantity_exit}
                      style={{ width: '85%', marginRight: '5%', marginTop: 10 }}
                    />
                  </label>
                </Col>

                <Col span={3}>
                  <label>
                    {' '}
                    Qtde restante:
                    <Input
                      disabled={true}
                      name="quantity_rest"
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.01"
                      value={selectExit.quantity_rest}
                      style={{ width: '75%', marginRight: '10%', marginTop: 10 }}
                    />

                    {(exits.length !== 1) && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveClick(index)}
                      />
                    )}

                  </label>
                </Col>

              </Row>

              <Divider />

            </>
          )
        })}
        {show == true && <BarcodeReader onScan={BarcodeScan} />}

        <Divider />

      </Modal>

    </>
  );
}
