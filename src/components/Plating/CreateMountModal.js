import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, Modal, Row, Select, Button, Divider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import { SeccionadoraMountContext } from '../../contexts/Plating/Mount/SeccionadoraMountContext';
import api from '../../services/api';
import { Notification } from '../Notification';

const { TextArea } = Input;

const Option = Select.Option;
function CreateMountModal() {
  const { setIsCreatMountModalOpen } = useContext(SeccionadoraMountContext);
  const { sectorId } = useContext(PlatingMountContext);

  const [productionPlanControlId, setProductionPlanControlId] = useState(1);
  const [color, setColor] = useState('');
  const [colorName, setColorName] = useState('');
  const [productionsPlansControl, setProductionsPlansControl] = useState([{}]);
  const [selectedSubProducts, setSelectSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [subProducts, setSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [products, setProducts] = useState([{}]);
  const [productId, setProductId] = useState(1);
  const handleCreateMount = () => {};

  const [productionPlanControlPage, setProductionPlanControlPage] = useState(1);
  useEffect(() => {
    api
      .get('product-plan-control', {
        params: {
          page: productionPlanControlPage,
        },
      })
      .then((response) => {
        if (productionPlanControlPage !== 1) {
          setProductionsPlansControl([
            ...productionsPlansControl,
            ...response.data,
          ]);
        } else {
          setProductionsPlansControl(response.data);
        }
      });
  }, [productionPlanControlPage]);
  const [productPage, setProductPage] = useState(1);

  const handleProductionPlanControl = async (e) => {
    setProductionPlanControlId(e);

    const response = await api.get(`product/production-plan-controller/${e}`);

    setProducts(response.data);
  };

  const handleProduct = async (e) => {
    setProductId(e);

    try {
      const response = await api.get(
        `product-plan-control/sub-product?product=${e}&sector=${sectorId}&pcp=${productionPlanControlId}`
      );

      setSubProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubProduct = (value, index) => {
    var NewArray = [...selectedSubProducts];

    // NewArray[index].subProductId = value;

    setSelectSubProducts(NewArray);
  };

  const HandleChange = (e, index) => {
    var NewArray = [...selectedSubProducts];
    var { name, value } = e.target;
    var totalAmount = +value;

    if (value > 0 || value == '') {
      selectedSubProducts.map((item, subProductIndex) => {
        if (
          selectedSubProducts[index].subProductId == item.subProductId &&
          subProductIndex != index
        ) {
          totalAmount += +item.amount;
        }
      });

      var subProductIndex = subProducts.findIndex(
        (item) => item.id === selectedSubProducts[index].subProductId
      );

      if (subProducts[subProductIndex].amount < totalAmount) {
        Notification(
          'error',
          'Erro na quantidade',
          'Tem mais itens no monte do que no PCP'
        );
      } else {
        NewArray[index][name] = value;

        setSelectSubProducts(NewArray);
      }
    } else {
      Notification(
        'error',
        'Erro na quantidade',
        'Valor nao pode ser negativo'
      );
    }
  };

  const handleRemoveClick = (index) => {
    const list = [...selectedSubProducts];
    list.splice(index, 1);
    setSelectSubProducts(list);
  };
  const handleAddClick = () => {
    setSelectSubProducts([
      ...selectedSubProducts,
      { subProductId: '', subProductName: '', amount: 0 },
    ]);
  };

  return (
    <Modal
      title="Criação do Monte"
      visible={true}
      width={700}
      footer={[
        <Button
          key="back"
          type="default"
          onClick={(e) => setIsCreatMountModalOpen(false)}
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          // loading={loading}
          onClick={handleCreateMount}
        >
          Salvar
        </Button>,
      ]}
    >
      <Row gutter={5}>
        <Col span={12}>
          <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={productionPlanControlId}
              onChange={(e) => handleProductionPlanControl(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onPopupScroll={(e) => {
                const { target } = e;
                if (
                  target.scrollTop + target.offsetHeight ===
                  target.scrollHeight
                ) {
                  setProductionPlanControlPage(productionPlanControlPage + 1);
                }
              }}
            >
              {productionsPlansControl.map((option) => {
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

        <Col span={12}>
          <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={colorName}
              onChange={(e) => {
                setColorName(e[1]);
                setColor(e[0]);
              }}
              style={{ color: `${color}` }}

              // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
            >
              <>
                <Option
                  key={1}
                  value={['yellow', 'Amarelo']}
                  style={{ color: 'yellow' }}
                >
                  Amarelo
                </Option>
                <Option
                  key={2}
                  value={['blue', 'Azul']}
                  style={{ color: 'blue' }}
                >
                  Azul
                </Option>
                <Option
                  key={3}
                  value={['red', 'Vermelho']}
                  style={{ color: 'red' }}
                >
                  Vermelho
                </Option>
                <Option
                  key={4}
                  value={['pink', 'Rosa']}
                  style={{ color: 'pink' }}
                >
                  Rosa
                </Option>
                <Option
                  key={5}
                  value={['black', 'Preto']}
                  style={{ color: 'black' }}
                >
                  Preto
                </Option>
                <Option
                  key={6}
                  value={['green', 'Verde']}
                  style={{ color: 'green' }}
                >
                  Verde
                </Option>
              </>
            </Select>
          </Form.Item>
        </Col>

        <Col span={19}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Produto:"
            labelAlign={'left'}
          >
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={productId}
              onChange={(e) => handleProduct(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {products.map((option) => {
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
      <Divider />
      {selectedSubProducts.map((selectedSubProduct, index) => {
        return (
          <>
            <Row gutter={5}>
              <Col span={16}>
                <Form.Item
                  labelCol={{ span: 23 }}
                  label="SubProduto:"
                  labelAlign={'left'}
                >
                  <Select
                    showSearch
                    placeholder="Selecione"
                    size="large"
                    value={selectedSubProduct.subProductName}
                    onChange={(e) => handleSubProduct(e, index)}

                    // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                  >
                    {subProducts.map((option) => {
                      return (
                        <>
                          <Option
                            key={option.id}
                            value={[option.id, option.name]}
                          >
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
                  label="Quantidade:"
                  labelAlign={'left'}
                  style={{ width: '90%', marginRight: 16 }}
                >
                  <Input
                    name="amount"
                    placeholder="Quantidade"
                    type={'number'}
                    min={0}
                    value={selectedSubProduct.amount}
                    onChange={(e) => HandleChange(e, index)}
                    style={{ width: '85%', marginRight: 8 }}
                  />
                  {selectedSubProducts.length !== 1 && (
                    <MinusCircleOutlined
                      onClick={() => handleRemoveClick(index)}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {selectedSubProducts.length - 1 === index && (
              <Button
                key="primary"
                title="Nova Linha"
                style={{ width: '100%' }}
                onClick={handleAddClick}
              >
                <PlusOutlined />
                Subproduto
              </Button>
            )}
          </>
        );
      })}
    </Modal>
  );
}

export { CreateMountModal };
