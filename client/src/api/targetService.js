// লোকাল স্টোরেজ থেকে টোকেন বের করার সবচেয়ে স্মার্ট উপায়
const getAuthHeaders = () => {
  let token = localStorage.getItem('token');
  
  // যদি সরাসরি 'token' নামে না থাকে, তবে 'user', 'auth-storage', বা 'auth_token' এর ভেতর থেকে খুঁজবে
  if (!token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    token = user?.token || user?.accessToken;
  }
  if (!token) {
    const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    token = authStore?.state?.user?.token || authStore?.state?.token;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};