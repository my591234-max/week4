import { useState, useEffect } from 'react';
import axios from 'axios';

// 引入 Bootstrap CSS (確保樣式正常)
import 'bootstrap/dist/css/bootstrap.min.css';

// 引入拆分後的元件
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';
import DelProductModal from './components/DelProductModal';

// 定義 API 環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false); // 登入狀態
  const [products, setProducts] = useState([]); // 產品列表
  const [pageInfo, setPageInfo] = useState({}); // 分頁資訊

  // Modal 相關狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false); // 判斷是新增還是編輯

  // 暫存產品資料 (表單用)
  const [tempProduct, setTempProduct] = useState({
    title: '',
    category: '',
    origin_price: 0,
    price: 0,
    unit: '',
    description: '',
    content: '',
    is_enabled: 1,
    imageUrl: '',
    imagesUrl: [],
  });

  // 登入表單狀態
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });

  // 檢查使用者是否已登入
  const checkLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (err) {
      console.error(err);
      setIsAuth(false);
    }
  };

  // 應用程式初始化時檢查登入
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$|^.*$/,
      '$1',
    );
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      checkLogin();
    }
  }, []);

  // 登入函式
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
      getProducts();
    } catch (err) {
      alert('登入失敗');
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value });
  };

  // 取得產品列表
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (err) {
      alert('取得產品失敗');
    }
  };

  // 開啟 Modal (新增/編輯/刪除)
  const openModal = (type, product) => {
    if (type === 'create') {
      setTempProduct({
        title: '',
        category: '',
        origin_price: 0,
        price: 0,
        unit: '',
        description: '',
        content: '',
        is_enabled: 1,
        imageUrl: '',
        imagesUrl: [],
      });
      setIsNew(true);
      setIsProductModalOpen(true);
    } else if (type === 'edit') {
      setTempProduct({ ...product });
      setIsNew(false);
      setIsProductModalOpen(true);
    } else if (type === 'delete') {
      setTempProduct(product);
      setIsDelProductModalOpen(true);
    }
  };

  // 表單輸入變更 (傳遞給 ProductModal 用)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 多圖變更處理
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({ ...tempProduct, imagesUrl: newImages });
  };

  const handleAddImage = () => {
    const newImages = [...(tempProduct.imagesUrl || []), ''];
    setTempProduct({ ...tempProduct, imagesUrl: newImages });
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({ ...tempProduct, imagesUrl: newImages });
  };

  // 送出新增或編輯
  const updateProduct = async () => {
    let api = `${BASE_URL}/v2/api/${API_PATH}/admin/product`;
    let method = 'post';

    if (!isNew) {
      api = `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`;
      method = 'put';
    }

    // 確保數值型別正確
    const data = {
      ...tempProduct,
      origin_price: Number(tempProduct.origin_price),
      price: Number(tempProduct.price),
    };

    try {
      await axios[method](api, { data });
      alert(isNew ? '新增成功' : '更新成功');
      setIsProductModalOpen(false);
      getProducts(pageInfo.current_page);
    } catch (err) {
      alert('更新失敗');
    }
  };

  // 刪除產品
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`);
      alert('刪除成功');
      setIsDelProductModalOpen(false);
      getProducts(pageInfo.current_page);
    } catch (err) {
      alert('刪除失敗');
    }
  };

  // 若未登入顯示登入頁面
  if (!isAuth) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
          <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  value={account.username}
                  onChange={handleLoginInputChange}
                  required
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={account.password}
                  onChange={handleLoginInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 已登入顯示產品列表
  return (
    <div className="container mt-4">
      <div className="text-end mb-4">
        <button className="btn btn-primary" onClick={() => openModal('create')}>
          建立新的產品
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.category}</td>
              <td>{product.title}</td>
              <td>{product.origin_price}</td>
              <td>{product.price}</td>
              <td>
                {product.is_enabled ? (
                  <span className="text-success">啟用</span>
                ) : (
                  <span>未啟用</span>
                )}
              </td>
              <td>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openModal('edit', product)}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openModal('delete', product)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分頁元件 */}
      <Pagination pageInfo={pageInfo} handlePageChange={getProducts} />

      {/* 新增/編輯 Modal */}
      <ProductModal
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        updateProduct={updateProduct}
        isNew={isNew}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
      />

      {/* 刪除 Modal */}
      <DelProductModal
        tempProduct={tempProduct}
        deleteProduct={deleteProduct}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
      />
    </div>
  );
}

export default App;
