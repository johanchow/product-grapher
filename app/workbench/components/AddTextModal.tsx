"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AddTextModal.module.scss'; // 导入样式文件

interface AddTextModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (values: { text: string, font: string }) => void;
}

const AddTextModal: React.FC<AddTextModalProps> = ({ showModal, setShowModal, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [textValue, setTextValue] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');

  const onSubmitForm = (data: any) => {
    onSubmit({ text: data.text, font: selectedFont });
    setShowModal(false);
  };

  return (
    showModal && (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2>插入文字</h2>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <label htmlFor="fontSelect">选择字体:</label>
            <select
              id="fontSelect"
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>

            <textarea
              {...register("text", { required: true })}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="请输入要插入的文字"
            />
            {errors.text && <p className={styles.error}>请填写文字说明</p>}

            <div className={styles.preview}>
              <span className={styles.previewLabel}>预览</span>
              <span style={{ fontFamily: selectedFont }}>{textValue}</span>
            </div>

            <div className={styles.footer}>
              <button type="submit" className={styles.primary}>提交</button>
              <button type="button" onClick={() => setShowModal(false)}>取消</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddTextModal;
