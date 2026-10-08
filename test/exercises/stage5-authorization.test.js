// Stage 5 exercises: these pass once the @requires / @restrict annotations are in place
const cds = require('@sap/cds')
const { POST, PATCH, expect } = cds.test(__dirname + '/../..')

const as = username => ({ auth: { username, password: '' } })
const NEW_BY_ALICE = 'b1b2c3d4-0002-4000-8000-000000000001'
const SUBMITTED_BY_ALICE = 'b1b2c3d4-0002-4000-8000-000000000002'

describe('Stage 5: authorization', () => {
  beforeEach(() => cds.test.data.reset())

  it('does not let an approver create requests', async () => {
    await expect(POST('/odata/v4/request/PurchaseRequests', { title: 'x' }, as('bob'))).to.be.rejectedWith(/403/)
  })

  it('does not let a requester approve', async () => {
    await expect(POST('/odata/v4/approval/approve', { request: SUBMITTED_BY_ALICE }, as('alice'))).to.be.rejectedWith(/403/)
  })

  it('does not let a requester change someone else\'s request', async () => {
    await expect(PATCH(`/odata/v4/request/PurchaseRequests(${NEW_BY_ALICE})`, { title: 'hijacked' }, as('carol')))
      .to.be.rejectedWith(/40[34]/)
  })
})
