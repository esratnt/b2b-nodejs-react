import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProtectedInfo, onLogout, onAddToCart } from '../api/auth';
import Layout from '../components/layout';
import { unauthenticateUser } from '../redux/slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState([]);
  const [adet, setAdet] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const userId = useSelector((state) => state.auth.userId);

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log(error.response);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();
      setProtectedData(data);
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    protectedInfo();
  }, []);

// client/src/components/Dashboard.js

// ...
const addToCart = async (userId, urun_id, adet, gonderi_sekli, siparis_notu) => {
  try {
    const isAuth = localStorage.getItem('isAuth');
    if (!isAuth) {
      console.log('Lütfen giriş yapın.');
      return;
    }

    await onAddToCart(userId, urun_id, adet, gonderi_sekli, siparis_notu);
    console.log('Ürün sepete eklendi.');

  } catch (error) {
    console.log(error.response);
  }
};
// ...


  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>Ürünler</h1>
        <table className="table table-primary">
          <thead>
            <tr>
              <th>Stok Kodu</th>
              <th>Araç</th>
              <th>Ürün</th>
              <th>Fiyat</th>
              <th>KDV</th>
              <th>Stok Durumu</th>
              <th>Adet</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {protectedData &&
              protectedData.products &&
              protectedData.products.map((product) => (
                <tr
                  key={product.stok_kodu}
                  className={product.stok ? 'table-light' : 'table-danger'}
                >
                  <td>{product.stok_kodu}</td>
                  <td>{product.arac}</td>
                  <td>{product.urun}</td>
                  <td>{product.fiyat}</td>
                  <td>{product.kdv}</td>
                  <td>{product.stok ? 'Stokta Var' : 'Stokta Yok'}</td>
                  <td>
                    {product.stok ? (
                      <input
                        type="number"
                        min="1"
                        max="100"
                        defaultValue="1"
                        onChange={(e) => setAdet(e.target.value)}
                      />
                    ) : (
                      'Stokta Yok'
                    )}
                  </td>
                  <td>
                    {product.stok ? (
                      <div>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() =>
                            addToCart(
                              userId,
                              product.id, // Burada 'id' özelliğini kullanıyoruz
                              adet,
                              // Diğer parametreleri ekleyebilirsiniz
                            )
                          }
                        >
                          Sepete Ekle
                        </button>
                      </div>
                    ) : (
                      'Stokta Yok'
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default Dashboard;
