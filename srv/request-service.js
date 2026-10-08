const cds = require('@sap/cds')

module.exports = class RequestService extends cds.ApplicationService {
  init() {
    const { PurchaseRequests } = this.entities

    // TODO Stage 4.1: validation + determination (RAP: validation / determination on save)
    // In a before CREATE/UPDATE handler on PurchaseRequests:
    //   - if any item has quantity <= 0, call req.error(400, 'QUANTITY_POSITIVE', 'items')
    //   - otherwise set req.data.total = sum of quantity * price over req.data.items
    // Hint: only do this when req.data.items is present (a PATCH may not send items).
    this.before(['CREATE', 'UPDATE'], PurchaseRequests, req => {
    })

    // TODO Stage 4.2: bound action submit (RAP: action in the behavior definition)
    //   - read the request's status with SELECT.one.from(PurchaseRequests, ID)
    //   - reject with 409 'ONLY_NEW_CAN_BE_SUBMITTED' unless status is 'New'
    //   - set status to 'Submitted' with UPDATE(...).with(...)
    // Hint: the key of a bound action's entity is in req.params[0]
    this.on('submit', PurchaseRequests, async req => {
    })

    return super.init()
  }
}
