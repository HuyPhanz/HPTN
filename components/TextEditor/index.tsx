import "react-quill/dist/quill.snow.css";
import {useCallback} from "react";
import {useTranslation} from "react-i18next";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : (): boolean => false;

interface TextEditorProps {
  width?: string | number;
  height?: string | number;
  placeholder?: string;
  onChange?: (e: string) => void;
  defaultValue?: string;
  isColor?: boolean;
  isVideo?: boolean;
  isClean?: boolean;
  value?: string;
  onBlur?: (e: string) => void;
}

function TextEditorGlobal(props: TextEditorProps): JSX.Element {
  const {
    onChange,
    width,
    height,
    placeholder,
    isColor,
    isVideo,
    isClean,
    value,
    defaultValue,
    onBlur,
  } = props;

  const icons = ReactQuill.Quill.import("ui/icons");
  icons.indent["+1"] =
    '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"></polyline> </svg>';

  const customArr = ["link"];
  if (isVideo) {
    customArr.push("video");
  }
  const modules = {
    toolbar: [
      [{size: []}],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
      isColor ? [{color: []}] : undefined,
      [{align: []}],
      customArr.length > 0 ? [...customArr] : undefined,
      isClean ? ["clean"] : undefined,
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "color",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "indent",
    "link",
    "image",
    "video",
    "customicon",
  ];

  const {t} = useTranslation(["translation"], {
    keyPrefix: "translation:common.input",
  });

  const renderText = useCallback(() => {
    return (
      <ReactQuill
        theme="snow"
        // key={language.lang}
        style={{width: width, height: height}}
        modules={modules}
        formats={formats}
        placeholder={placeholder || t("des")}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    );
  }, [placeholder, onBlur, onChange, value]);

  return renderText();
}

export {TextEditorGlobal};
