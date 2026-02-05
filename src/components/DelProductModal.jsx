// src/components/DelProductModal.jsx
import { useEffect, useRef } from 'react';
import * as bootstrap from 'bootstrap';

function DelProductModal({ tempProduct, deleteProduct, isOpen, setIsOpen }) {
  const delProductModalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    modalInstance.current = new bootstrap.Modal(delProductModalRef.current, {
      backdrop: 'static',
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalInstance.current.show();
    } else {
      modalInstance.current.hide();
    }
  }, [isOpen]);

  const closeDelModal = () => {
    setIsOpen(false);
  };

  return (
    <div ref={delProductModalRef} className="modal fade" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content border-0">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeDelModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            是否刪除
            <strong className="text-danger"> {tempProduct.title} </strong>
            商品(刪除後將無法恢復)。
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDelModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteProduct(tempProduct.id)}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelProductModal;
