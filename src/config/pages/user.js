


const tabs = [
  { title: 'Users', icon: 'mdi-accounts', count: 0 ,key:'users'},
  { title: 'Deleted', icon:'mdi-trash',count:0,key:'trash'},
]
const breadCrumbs=[
  {
    title: 'Dashbaord',
    disabled: false,
    href: '/',
  },
    
  {
    title: 'User List',
    disabled: true,
    href: 'users',
  },


]

const search=[
  {
    name: 'Common',
    id: 'all',
  },
  {
    name:'id',
    id: 'id',
  },
  {
    name:'date based',
    id: 'created_at',
  },
]


const headers= [
 
  {
    title: '#ID',
    key: 'id',
    width:'80px',
  },
 
 
  {
    title: 'Email',
    key: 'email',
  },
  {
    title:'Role',
    key: 'role',
  },
 
  {
    title: 'Register Date',
    key: 'created_at',
  },
    
]

export default function usePageConfig() {
  return {
    headers,
    tabs,
    breadCrumbs,
    search,
  }
}
