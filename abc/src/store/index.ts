import { createStore } from 'vuex'
import { state, getters } from './variable'
import { mutations, actions } from './method'
const modulesFiles: any = import.meta.globEager('./modules/*.ts')
const modules: any = {}
Object.keys(modulesFiles).forEach((key: string) => {
  const module = modulesFiles[key].default
  const moduleKey = `${key.replace(/(\.\/|\.js)/g, "")}`

  modules[module.name || moduleKey] = module
  modules[module.name || moduleKey]["namespaced"] = true
})

const store: any = createStore({
  state,
  getters,
  mutations,
  actions,
  modules
})

export default store
