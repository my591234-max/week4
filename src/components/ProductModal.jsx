import { useEffect, useRef } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';

// 環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
  tempProduct,
  setTempProduct, // 用於上傳圖片後更新資料
  updateProduct,
  isNew,
  isOpen,
  setIsOpen,
  handleInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
}) {
  const productModalRef = useRef(null);
  const modalInstance = useRef(null);

  // 初始化 Modal
  useEffect(() => {
    modalInstance.current = new bootstrap.Modal(productModalRef.current, {
      backdrop: 'static',
    });
  }, []);

  // 監聽 isOpen 變化來控制開啟/關閉
  useEffect(() => {
    if (isOpen) {
      modalInstance.current.show();
    } else {
      modalInstance.current.hide();
    }
  }, [isOpen]);

  const closeProductModal = () => {
    setIsOpen(false);
  };

  // 圖片上傳處理函式
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file-to-upload', file); // 欄位名稱需與後端一致

    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
        formData,
      );

      // 上傳成功，將回傳的網址寫入 tempProduct.imageUrl
      setTempProduct({
        ...tempProduct,
        imageUrl: res.data.imageUrl,
      });

      e.target.value = ''; // 清空 input 讓同一張圖可重複選取
      alert('圖片上傳成功！');
    } catch (error) {
      console.error(error);
      alert('圖片上傳失敗');
    }
  };

  return (
    <div ref={productModalRef} className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">
              <span>{isNew ? '新增產品' : '編輯產品'}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeProductModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      輸入圖片網址
                    </label>
                    <input
                      value={tempProduct.imageUrl || ''}
                      onChange={handleInputChange}
                      name="imageUrl"
                      type="text"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>

                  {/* 圖片上傳按鈕區塊 */}
                  <div className="mb-3">
                    <label htmlFor="upload-img" className="form-label">
                      或 上傳圖片
                    </label>
                    <input
                      type="file"
                      id="upload-img"
                      className="form-control"
                      onChange={uploadFile}
                    />
                  </div>

                  <img
                    className="img-fluid"
                    src={tempProduct.imageUrl}
                    alt=""
                  />
                </div>

                {/* 多圖功能 */}
                <div>
                  {tempProduct.imagesUrl &&
                    tempProduct.imagesUrl.length > 0 &&
                    tempProduct.imagesUrl.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label className="form-label">
                          圖片網址 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                          type="text"
                          className="form-control mb-2"
                          placeholder="請輸入圖片連結"
                        />
                        {image && (
                          <img className="img-fluid mb-2" src={image} alt="" />
                        )}
                      </div>
                    ))}
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 me-2"
                      onClick={handleAddImage}
                    >
                      新增圖片
                    </button>
                    {tempProduct.imagesUrl &&
                      tempProduct.imagesUrl.length > 0 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={handleRemoveImage}
                        >
                          刪除最後一張
                        </button>
                      )}
                  </div>
                </div>
              </div>

              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={tempProduct.title || ''}
                    onChange={handleInputChange}
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category || ''}
                      onChange={handleInputChange}
                      name="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit || ''}
                      onChange={handleInputChange}
                      name="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={tempProduct.origin_price || ''}
                      onChange={handleInputChange}
                      name="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={tempProduct.price || ''}
                      onChange={handleInputChange}
                      name="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
                <hr />

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={tempProduct.description || ''}
                    onChange={handleInputChange}
                    name="description"
                    className="form-control"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={tempProduct.content || ''}
                    onChange={handleInputChange}
                    name="content"
                    className="form-control"
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      checked={!!tempProduct.is_enabled} // 確保是 boolean
                      onChange={handleInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                    />
                    <label className="form-check-label">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeProductModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateProduct}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
