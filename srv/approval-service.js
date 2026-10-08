const cds = require('@sap/cds')

module.exports = class ApprovalService extends cds.ApplicationService {
  init() {
    const { PurchaseRequests } = cds.entities('pr')

    // TODO Stage 4.3: approve and reject actions
    //   - req.data has { request, comment }
    //   - reject with 404 'REQUEST_NOT_FOUND' if the request does not exist
    //   - reject with 409 'ONLY_SUBMITTED_CAN_BE_DECIDED' unless status is 'Submitted'
    //   - on approve, reject with 403 'NO_SELF_APPROVAL' if createdBy === req.user.id
    //   - update status ('Approved' / 'Rejected') and comment
    //   - bonus: after approving, this.emit('RequestApproved', { ID, approver: req.user.id })
    this.on('approve', async req => {
    })

    this.on('reject', async req => {
    })

    return super.init()
  }
}
