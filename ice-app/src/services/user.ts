const curData = localStorage.getItem('userInfo') || '{}'
const userInfo = JSON.parse(curData)

export async function fetchUserInfo() {
  return userInfo;
}

export async function logout() {
  console.log('logout');
}
