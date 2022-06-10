const AccessControl = require('role-acl')
const ac = new AccessControl()
//create product
ac.grant('staff').execute('create').on('product')
ac.grant('user').execute('create').on('product')
ac.grant('admin').execute('create').on('product')


//update product
ac.grant('staff')
  .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
  .execute('update')
  .on('product')


//delete product
ac.grant('staff')
  .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
  .execute('delete')
  .on('product')

//read products  
ac.grant('public').execute('read').on('products')
ac.grant('user').execute('read').on('products')
ac.grant('staff').execute('read').on('products')

//read product
ac.grant('public').execute('read').on('product')
ac.grant('user').execute('read').on('product')
ac.grant('admin').execute('read').on('product')



exports.readAll = (requester) => ac.can(requester.role).execute('read').sync().on('products')


exports.read = (requester) => ac.can(requester.role).execute('read').sync().on('product')



exports.create = (requester) => ac.can(requester.role).execute('create').sync().on('product')


exports.update = (requester, data) => ac.can(requester.role).context({ requester: requester.companyCode, owner: data.companyCode }).execute('update').sync().on('product')

exports.delete = (requester, data) => ac.can(requester.role).context({ requester: requester.companyCode, owner: data.companyCode }).execute('delete').sync().on('product')
