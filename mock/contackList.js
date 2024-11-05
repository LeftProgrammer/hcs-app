export default [
  {
    url: '/person/personInfo/getPersonInfoNoPage',
    method: 'get',
    response: () => {
      console.log('Mock API called: /api/user/getUser')
      return {
        code: 200,
        result: {
          name: 'Tom',
          age: 25,
        },
      }
    },
  },
]
