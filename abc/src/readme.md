import {
  reactive, // 用于返回对象的深层响应式代理
  readonly, // 用于返回响应式对象（或ref）的深层只读代理
  isProxy, // 检查对象是否是 reactive 或 readonly 创建的
  isReactive, // 检查对象是否是 reactive创建的响应式代理
  isReadonly, // 检查对象是否是由readonly创建的只读代理
  toRaw, // 用于返回 reactive 或 readonly 代理的原始对象
  markRaw, // 标记一个对象，使其永远不会转换为代理。返回对象本身
  shallowReactive, // 用于返回对象的浅层响应式代理
  shallowReadonly, // 用于返回响应式对象（或ref）的浅层只读代理
  ref, // 用于返回非对象值的响应式代理
  unref, // 判断是否是 ref，如果是则返回ref否则返回参数本身
  toRef, // 用于为响应式对象上的属性建立ref代理
  toRefs, // 将响应式对象转换为普通对象，结果的每个属性都指向原始对象相应属性的ref
  isRef, // 检查值是否为ref对象
  customRef, // 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制
  shallowRef, // 创建一个 ref，它跟踪自己的 .value 更改，但不会使其值成为响应式的。非reactive 的响应式对象代理
  triggerRef, // 手动执行与 shallowRef 关联的任何效果
  computed, // 返回一个不变的响应式ref或可写的ref对象
  watchEffect, // 立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数
  watch, // 侦听特定的数据，回调仅在侦听源发生更改时调用
  provide, // 设置一个被注入到应用范围内所有组件中的值
  inject, // 接收provide提供的值
  onBeforeMount, // 在挂载开始之前被调用，该钩子在服务器端渲染期间不被调用
  onMounted, // 实例被挂载后调用，该钩子在服务器端渲染期间不被调用
  onBeforeUpdate, // 数据更新时调用，发生在虚拟 DOM 打补丁之前，只有初次渲染会在服务端进行
  onUpdated, // 数据更改导致的虚拟 DOM 重新渲染和打补丁之后会调用该钩子
  onBeforeUnmount, // 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。服务器端渲染期间不被调用
  onUnmounted, // 卸载组件实例后调用，服务器端渲染期间不被调用
  onErrorCaptured, // 当捕获一个来自子孙组件的错误时被调用
  onRenderTracked, // 跟踪虚拟 DOM 重新渲染时调用
  onRenderTriggered, // 当虚拟 DOM 重新渲染后调用
  getCurrentInstance
} from 'vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup (props, context) {
    console.log(props, context, getCurrentInstance())
    const data = { count: 0 }
    const item = { count: 0 }

    const obj = reactive(data)
    const copy = readonly(data)
    console.log(isProxy(obj), isReactive(obj), isReadonly(obj)) // true true false
    console.log(isProxy(copy), isReactive(copy), isReadonly(copy)) // true false true

    console.log(toRaw(obj) === data, toRaw(obj) === item, toRaw(copy) === item, toRaw(copy) === data) // true false false true
    obj.count = 1
    console.log(toRaw(obj) === data, toRaw(obj) === item, toRaw(copy) === item, toRaw(copy) === data) // true false false true

    const foo = markRaw({})
    const bar = reactive({ foo })
    console.log(isReactive(reactive(foo)), isReactive(reactive(bar.foo)))

    const state = shallowReactive({
      foo: 0,
      nested: {
        bar: 0
      }
    })
    console.log(isReactive(state.nested)) // false
    const setFoo = (() => {  // 数据更新触发视图更新
      state.foo++
      console.log(state.nested.bar)
    })
    const setBar = (() => { // 数据更新不会触发视图更新
      state.nested.bar++
      console.log(state.nested.bar)
    })

    const state2 = shallowReadonly({
      foo: 0,
      nested: {
        bar: 0
      }
    })
    console.log(isReadonly(state.nested)) // false
    const setFoo2 = (() => {  // 数据只读不可更改
      state2.foo++
      console.log(state2.nested.bar) // 0
    })
    const setBar2 = (() => { // 数据可更新不会触发视图更新
      state2.nested.bar++
      console.log(state2.nested.bar) // ++
    })

    const count = ref(0) // 视图同步更新
    console.log(count.value) // 0
    count.value++
    console.log(count.value) // 1

    console.log(unref(ref(1)), unref(1)) // 1 1

    const state3 = reactive({
      foo: 0,
      bar: 0
    })
    const fooRef = toRef(state3, 'foo') // 视图同步更新
    fooRef.value++
    console.log(state3.foo) // 2
    state3.foo++
    console.log(fooRef.value) // 3
    const setfooRef = (() => {
      fooRef.value++
    })
    const setfooRef2 = (() => {
      state3.foo++
    })

    const state4 = reactive({
      foo: 0,
      bar: 0
    })
    const stateAsRefs = toRefs(state4) // 视图同步更新
    state4.foo++
    console.log(stateAsRefs.foo.value) // 2
    stateAsRefs.foo.value++
    console.log(state4.foo) // 3
    const setfooRefs = (() => {
      stateAsRefs.foo.value++
    })
    const setfooRefs2 = (() => {
      state4.foo++
    })

    console.log(isRef(obj), isRef(count), isRef(fooRef), isRef(stateAsRefs), isRef(stateAsRefs.foo), isRef(1)) // false true true false true false

    const useDebouncedRef = (value, delay = 2000) => { // 可用于防抖截流
      let timeout
      return customRef((track, trigger) => {
        return {
          get () {
            track()
            return value
          },
          set (newValue) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              if (Array.isArray(newValue)) {
                value.length = 0
                newValue.forEach(item => {
                  value.push(item)
                })
              } else {
                value = newValue
              }
              console.log(value)
              trigger()
            }, delay)
          }
        }
      })
    }
    const arrData = useDebouncedRef([{ a: 1 }])
    const setState5 = () => {
      arrData.value = ([{ a: 2 }])
    }

    const foo3 = shallowRef({ greet: 0 }) // 非reactive 的响应式对象代理
    isReactive(foo3.value) // false
    const setFoo3 = () => { // 视图同步更新
      foo3.value = { greet: foo3.value.greet + 1 }
      console.log(foo3.value)
    }
    const set3Foo = () => { // 视图没有同步更新
      foo3.value.greet++
      console.log(foo3.value)
    }
    watchEffect(() => { // 监听自身依赖的响应式数据
      console.log('watchEffect监听数据', foo3.value.greet)
    })
    watch(foo3, (count, prevCount) => { // 监听特定数据
      console.log('watch监听数据', foo3.value.greet, count, prevCount)
    })
    watch([foo, foo3], ([count1, count2], [prevCount1, prevCount2]) => { // 监听多个特定数据
      console.log('watch监听数据', foo3.value.greet, count1, count2, prevCount1, prevCount2)
    })
    const setGreet = () => { // 视图没有更新
      foo3.value.greet++
    }
    const setGreet2 = () => {
      triggerRef(foo3) // 手动执行响应式代理
    }

    const count3 = ref(1)
    const plusOne = computed({
      get: () => count3.value + 1,
      set: val => {
        count3.value = val - 1
      }
    })
    console.log(count3.value, plusOne.value, plusOne.value = 1, count3.value) // 1 2 1 0

    // provide('keyData', {a: 'r', b: 9}) // 父组件注入
    const foo4 = inject('keyData') // 子组件接收
    console.log(foo4)

    onBeforeMount(() => {
      console.log('onBeforeMount')
    })
    onMounted(() => {
      console.log('onMounted')
    })
    onBeforeUpdate(() => {
      console.log('onBeforeUpdate')
    })
    onUpdated(() => {
      console.log('onUpdated')
    })
    onBeforeUnmount(() => {
      console.log('onBeforeUnmount')
    })
    onUnmounted(() => {
      console.log('onUnmounted')
    })
    onRenderTracked(() => {
      console.log('onRenderTracked')
    })
    onRenderTriggered(() => {
      console.log('onRenderTriggered')
    })
    onErrorCaptured(() => {
      console.log('onErrorCaptured')
    })

    return {
      state,
      state2,
      setFoo,
      setBar,
      setFoo2,
      setBar2,
      fooRef,
      state3,
      setfooRef,
      setfooRef2,
      state4,
      stateAsRefs,
      setfooRefs,
      setfooRefs2,
      test: useDebouncedRef('test'),
      arrData,
      setState5,
      foo3,
      setFoo3,
      set3Foo,
      setGreet,
      setGreet2
    }
  }
}