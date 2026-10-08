const cds = require('@sap/cds')

module.exports = class RequestService extends cds.ApplicationService {
  init() {
    const { PurchaseRequests } = this.entities

    // Validation + determination (RAP: validation / determination on save)
    this.before(['CREATE', 'UPDATE'], PurchaseRequests, req => {
      const { items } = req.data
      if (!items) return
      if (items.some(i => !(i.quantity > 0))) return req.error(400, 'QUANTITY_POSITIVE', 'items')
      req.data.total = items.reduce((sum, i) => sum + i.quantity * (i.price ?? 0), 0)
    })

    // Bound action (RAP: action in the behavior definition)
    this.on('submit', PurchaseRequests, async req => {
      const { ID } = req.params[0]
      const request = await SELECT.one.from(PurchaseRequests, ID).columns('status')
      if (!request) return req.reject(404, 'REQUEST_NOT_FOUND', [ID])
      if (request.status !== 'New') return req.reject(409, 'ONLY_NEW_CAN_BE_SUBMITTED')
      await UPDATE(PurchaseRequests, ID).with({ status: 'Submitted' })
    })

    return super.init()
  }
}
