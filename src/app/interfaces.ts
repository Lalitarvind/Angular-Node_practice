export interface GridRow{
  id:number,
  first_name:string,
  last_name:string,
  email:string,
  dob:Date,
  phone:string,
  gender:string
}

export interface permission{
  pid: number,
  action: string,
  checked: boolean
}

export interface module{
  mid: number,
  name: string,
  permissions: permission[]
}

export interface User{
  username: string,
  roleID: number,
  roleName: string,
  permissionIDs: number[]
  permissionNames: string[]
}

export interface role{
  id: number,
  role_name: string
}