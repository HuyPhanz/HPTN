import {IFilterGroupProps} from "@app/types";
import "./index.scss";
import {Select, Input, Button, Tooltip} from "antd";
import React, {useRef} from "react";
import {SearchOutlined} from "@ant-design/icons";

export default function FilterGroup(props: IFilterGroupProps): JSX.Element {
  const {
    titleTooltipSearch,
    haveInputSearch,
    onSearch,
    mainFilterText,
    placeholderSearch,
    listSelectFilter,
    listButton,
  } = props;

  const searchValue = useRef<string>("");

  function handleInputChange(event: {target: {value: string}}): void {
    searchValue.current = event.target.value;
  }

  function handleIconClick(): void {
    onSearch(searchValue.current);
  }

  return (
    <div className="container-filter">
      <div className="filter-group">
        {haveInputSearch && (
          <Tooltip title={titleTooltipSearch}>
            <Input
              placeholder={placeholderSearch}
              onPressEnter={(e: any) => {
                onSearch(e.target.value);
              }}
              value={mainFilterText as string}
              prefix={<SearchOutlined onClick={() => handleIconClick()} />}
              className="search-input"
              allowClear
              onChange={(e: any) => {
                handleInputChange(e);
                if (!e.target.value) {
                  onSearch(e.target.value);
                }
              }}
            />
          </Tooltip>
        )}

        {listSelectFilter &&
          listSelectFilter.map((selectItem, index) => (
            <Select
              key={index}
              placeholder={selectItem.placeholder}
              defaultValue={selectItem.defaultValue}
              onChange={selectItem.onChange}
              options={selectItem.data}
            />
          ))}
      </div>

      <div style={{display: "flex"}}>
        {listButton &&
          listButton.map((button, index) => (
            <div
              style={{marginRight: "10px"}}
              key={index}
              className="button-list"
            >
              <Button
                onClick={button.onClick}
                htmlType="button"
                className={button?.type}
                icon={button.startIcon && button.startIcon}
                disabled={button.isDisabled}
                loading={button.isLoading}
              >
                {button.title}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
