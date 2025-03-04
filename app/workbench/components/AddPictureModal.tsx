"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AddPictureModal.module.scss'; // 导入样式文件

interface AddPictureModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (option: 'upload' | 'text', description: string) => void;
}

const AddPictureModal: React.FC<AddPictureModalProps> = ({ showModal, setShowModal, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedOption, setSelectedOption] = useState<'upload' | 'text'>('upload'); // 选项状态

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'upload' | 'text');
  };

  const onSubmitForm = (data: any) => {
    const { description } = data;
    onSubmit(selectedOption, description);
    setShowModal(false); // 关闭弹窗
  };

  return (
    showModal && (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2>变换背景</h2>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="upload"
                  {...register("option", { required: true })}
                  onChange={handleOptionChange}
                />
                上传新背景图
              </label>
              <label>
                <input
                  type="radio"
                  value="text"
                  {...register("option", { required: true })}
                  onChange={handleOptionChange}
                />
                文字描述新背景
              </label>
            </div>
            {errors.option && <p className={styles.error}>请选择背景方式</p>}
            {selectedOption === 'upload' && (
              <input
                type="file"
                accept="image/*"
                {...register("file", { required: selectedOption === 'upload' })}
              />
            )}
            {selectedOption === 'text' && (
              <textarea
                {...register("description", { required: true })}
                placeholder="请输入文字说明"
              />
            )}
            {errors.file && <p className={styles.error}>请上传新背景图</p>}
            {errors.description && <p className={styles.error}>请填写文字说明</p>}
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

export default AddPictureModal;
