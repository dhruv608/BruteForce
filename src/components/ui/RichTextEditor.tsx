"use client";

import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Write your notes...",
  className = "",
}) => {
  const modules = {
    toolbar: [["bold", "italic"]],
  };

  return (
    <div className={`rte ${className} `}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        readOnly={disabled}
        theme="snow"
      />
    </div>
  );
};