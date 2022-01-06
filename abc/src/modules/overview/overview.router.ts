const children: any = [
  {
    path: "/overview",
    name: "Overview",
    meta: { title: "概览", weight: 1, show: true, roles: [] },
    component: () =>
      import(/* webpackChunkName: 'overview' */ "./index/index.vue")
  }
]

export default children
