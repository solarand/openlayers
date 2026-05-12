import React from "react";

import { Modal, Form, Input, InputNumber, Button } from "antd";

import { useDispatch } from "react-redux";

import { addObject, type MapObject } from "../store/slices/mapSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddObjectModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();

    onClose();
  };

  const handleFinish = (values: MapObject) => {
    dispatch(addObject(values));

    form.resetFields();

    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      title="Добавить объект"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Название"
          name="name"
          rules={[
            {
              required: true,
              message: "Введите название",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <Input />
        </Form.Item>

        <Form.Item
          label="Широта"
          name="lat"
          rules={[
            {
              required: true,
              message: "Введите широту",
            },
            {
              validator: (_, value) => {
                if (value < -90 || value > 90) {
                  return Promise.reject("Широта должна быть от -90 до 90");
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Долгота"
          name="lon"
          rules={[
            {
              required: true,
              message: "Введите долготу",
            },
            {
              validator: (_, value) => {
                if (value < -180 || value > 180) {
                  return Promise.reject("Долгота должна быть от -180 до 180");
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Создать
        </Button>
      </Form>
    </Modal>
  );
};

export default AddObjectModal;
