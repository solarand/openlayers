import React from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import type { MapObject } from "../store/slices/mapSlice";

interface AddObjectModalProps {
  visible: boolean;
  onCreate: (obj: MapObject) => void;
  onCancel: () => void;
}

const AddObjectModal: React.FC<AddObjectModalProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={visible}
      title="Добавить объект"
      okText="Добавить"
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values: MapObject) => {
          form.resetFields();
          onCreate(values);
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input />
        </Form.Item>
        <Form.Item name="lat" label="Широта" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="lon" label="Долгота" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddObjectModal;
