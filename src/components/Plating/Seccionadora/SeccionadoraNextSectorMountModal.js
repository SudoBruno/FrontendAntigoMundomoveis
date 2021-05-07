import { Button, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SeccionadoraMountContext } from '../../../contexts/Plating/Mount/SeccionadoraMountContext';
import api from '../../../services/api';
import { Notification } from '../../Notification';
const Option = Select.Option;
export function SeccionadoraNextSectorMountModal() {
  const { mount, sectorId, setShowNextSector } = useContext(
    SeccionadoraMountContext
  );

  const nextSector = async () => {
    // setLoading(true);
    try {
      mount.subProducts[0].amount = amount;
      mount.factorySectorId = sectorId;

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
      // setShowNextSector(false);
    } catch (error) {
      console.error(error);
      Notification(
        'error',
        'Erro ao gerar etiqueta',
        'Erro ao passar para o proximo setor, tente novamente'
      );
      // setLoading(false);
    }
  };
  const [productionsPlansControl, setProductionsPlansControl] = useState([{}]);
  const [products, setProducts] = useState([{}]);
  useEffect(() => {
    api
      .get(`production-plan-control/${mount.productionPlanControl}`, {})
      .then((response) => {
        setProductionsPlansControl(response.data);
      });
    api.get(`product/${mount.productId}`, {}).then((response) => {
      setProducts([response.data]);
    });
  }, []);

  const [amount, setAmount] = useState(mount.subProducts[0].amount);

  return (
    <>
      <Modal
        title="Passar para o proximo setor"
        visible={true}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            // onClick={handleClose}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            onClick={nextSector}
          >
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Select
                size="large"
                value={mount.productionPlanControlId}
                disabled
              >
                {productionsPlansControl.map((option) => {
                  return (
                    <>
                      <Option key={option.pcpId} value={option.pcpId}>
                        {option.pcpName}
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
              label="Produto:"
              labelAlign={'left'}
            >
              <Select size="large" value={mount.productId} disabled>
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
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Select
                size="large"
                value={mount.color}
                style={{ color: `${mount.color}` }}
                disabled
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
        </Row>
        <Divider />

        {mount.subProducts.map((selectedSubProduct, index) => {
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
                      value={mount.subProducts[0].subProductId}
                      disabled
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0 ||
                        option.props.value
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {mount.subProducts.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.subProductId}
                              value={option.subProductId}
                            >
                              {option.subProductName}
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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ width: '85%', marginRight: 8 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          );
        })}
      </Modal>
    </>
  );
}
