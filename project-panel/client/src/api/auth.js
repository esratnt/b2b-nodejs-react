import axios from 'axios'
axios.defaults.withCredentials = true

/*export async function onRegistration(registrationData) {
  return await axios.post(
    'http://localhost:8080/api/register',
    registrationData
  )
}
*/
export async function onLogin(loginData) {
  return await axios.post('http://localhost:8080/api/login', loginData)
}

export async function onLogout() {
  return await axios.get('http://localhost:8080/api/logout')
}

export async function fetchProtectedInfo() {
  return await axios.get('http://localhost:8080/api/protected')
}

export async function onAddToCart(userId, urun_id, adet, gonderi_sekli, siparis_notu) {
  return await axios.post('http://localhost:8080/api/sepete-ekle', {
    userId,
    urun_id,
    adet,
    gonderi_sekli,
    siparis_notu,
  });
}

export async function getSepet(){
  return await axios.get('http://localhost:8080/api/sepetim')
}


export async function deleteSepetItem(sepetId) {
  return await axios.delete(`http://localhost:8080/api/sepet-sil/${sepetId}`);
}