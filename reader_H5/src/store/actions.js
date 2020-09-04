const actions = {
  setFileName: ({ commit }, fileName) => {
    // return 可以返回一个promise对象
    return commit('SET_FILENAME', fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => {
    console.log(menuVisible);
    return commit('SET_MENUVISIBLE', menuVisible)
  },
}
export default actions