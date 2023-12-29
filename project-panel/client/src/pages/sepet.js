import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { getSepet, deleteSepetItem } from "../api/auth";

const Sepet = () => {
  const [sepetData, setSepetData] = useState([]);
  const [toplamFiyat, setToplamFiyat] = useState(0);
  const [gonderiSekli, setGonderiSekli] = useState("");
  const [siparisNotu, setSiparisNotu] = useState("");

  useEffect(() => {
    const fetchSepet = async () => {
      try {
        const response = await getSepet();
        setSepetData(response.data.sepet);

        // Toplam fiyatı hesapla
        const yeniToplamFiyat = response.data.sepet.reduce(
          (toplam, item) => toplam + item.adet * item.fiyat,
          0
        );
        setToplamFiyat(yeniToplamFiyat);
      } catch (error) {
        console.error("Sepet verileri getirilirken hata oluştu:", error);
      }
    };

    fetchSepet();
  }, []);

  const handleDelete = async (sepetId) => {
    try {
      await deleteSepetItem(sepetId);
      setSepetData((prevData) =>
        prevData.filter((item) => item.sepet_id !== sepetId)
      );

      // Ürün silindiğinde toplam fiyatı güncelle
      const yeniToplamFiyat = sepetData.reduce(
        (toplam, item) => toplam + item.adet * item.fiyat,
        0
      );
      setToplamFiyat(yeniToplamFiyat);
    } catch (error) {
      console.error("Ürün sepetten silinirken hata oluştu:", error);
    }
  };
  // ...

  // ...

  // ...

  const handleAdetChange = (sepetId, newAdet) => {
    // Adet değiştiğinde işlemleri buraya ekleyin
    console.log(`Ürün ${sepetId} adet değiştirildi: ${newAdet}`);

    // Adet değiştiğinde toplam fiyatı güncelle
    setSepetData((prevData) =>
      prevData.map((item) =>
        item.sepet_id === sepetId ? { ...item, adet: newAdet } : item
      )
    );

    setToplamFiyat((prevToplam) => {
      // Yeni toplam fiyatı hesapla
      const yeniToplamFiyat = sepetData.reduce(
        (toplam, item) =>
          toplam +
          (item.sepet_id === sepetId ? newAdet : item.adet) * item.fiyat,
        0
      );
      return yeniToplamFiyat;
    });
  };

  // ...

  // ...

  const handleGonderiSekliChange = (event) => {
    setGonderiSekli(event.target.value);
  };

  const handleSiparisNotuChange = (event) => {
    setSiparisNotu(event.target.value);
  };

  const handleSiparisiOlustur = () => {
    console.log("Sipariş oluşturuldu!");
  };

  return (
    <div>
      <Layout>
        <h1>Sepet</h1>
        <table className="table table-light">
          <thead>
            <tr className="table-primary">
              <th>Stok Kodu</th>
              <th>Araç</th>
              <th>Ürün</th>
              <th>Adet</th>
              <th>KDV</th>
              <th>Fiyat</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {sepetData.map((item) => (
              <tr key={item.sepet_id}>
                <td>{item.stok_kodu}</td>
                <td>{item.arac}</td>
                <td>{item.urun}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.adet}
                    onChange={(e) =>
                      handleAdetChange(item.sepet_id, e.target.value)
                    }
                  />
                </td>
                <td>{item.kdv}</td>
                <td>{item.fiyat}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(item.sepet_id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row">
          <div className="col-9">
            <p>Toplam Fiyat: {toplamFiyat} TL</p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label htmlFor="inputState" className="form-label">
              Gönderi şekli
            </label>
            <select
              id="inputState"
              className="form-select"
              value={gonderiSekli}
              onChange={handleGonderiSekliChange}
            >
              <option value="" disabled>
                Gönderi şeklini seçiniz...
              </option>
              <option>Aras Kargo</option>
              <option>MNG Kargo</option>
              <option>PTT Kargo</option>
            </select>
          </div>
          <div className="col">
            <label htmlFor="inputState" className="form-label">
              Sipariş Notu
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Sipariş Notu"
              aria-label="Last name"
              value={siparisNotu}
              onChange={handleSiparisNotuChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleSiparisiOlustur}
            >
              Siparişi Oluştur
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Sepet;
