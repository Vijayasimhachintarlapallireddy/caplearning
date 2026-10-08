const cds = require('@sap/cds')

module.exports = class ApprovalService extends cds.ApplicationService {
  init() {
    const { PurchaseRequests } = cds.entities('pr')

    const decide = status => async req => {
      const { request: ID, comment } = req.data
      const request = await SELECT.one.from(PurchaseRequests, ID).columns('status', 'createdBy')
      if (!request) return req.reject(404, 'REQUEST_NOT_FOUND', [ID])
      if (request.status !== 'Submitted') return req.reject(409, 'ONLY_SUBMITTED_CAN_BE_DECIDED')
      if (status === 'Approved' && request.createdBy === req.user.id) return req.reject(403, 'NO_SELF_APPROVAL')
      await UPDATE(PurchaseRequests, ID).with({ status, comment })
      if (status === 'Approved') await this.emit('RequestApproved', { ID, approver: req.user.id })
    }

    this.on('approve', decide('Approved'))
    this.on('reject', decide('Rejected'))

    return super.init()
  }
}
