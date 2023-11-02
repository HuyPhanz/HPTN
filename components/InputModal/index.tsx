import "./index.scss";
import {Col, Input, Row} from "antd";
import React from "react";
import classNames from "classnames";

interface InputModalProps {
  className?: string;
  label: string;
  placeholder: string;
  onChange: (value: any) => void;
  value?: string;
  require?: boolean;
  keyValue: string;
  defaultValue?: string;
}

export function InputModal(props: InputModalProps): JSX.Element {
  const {
    className,
    label,
    placeholder,
    onChange,
    value,
    require,
    keyValue,
    defaultValue,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange((prev: any) => ({
      ...prev,
      [keyValue]: e.target.value,
    }));
  };

  return (
    <Row className={classNames("input-modal-container", className)}>
      <Col md={4} className="label-item">
        <span className="require">{require ? "*" : ""}</span>
        {label}
      </Col>
      <Col md={20}>
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          className="input"
          defaultValue={defaultValue}
        />
      </Col>
    </Row>
  );
}
