// Stage 4 exercises: these tests fail until you implement the handlers in srv/*.js
const cds = require('@sap/cds')
const { GET, POST, expect } = cds.test(__dirname + '/../..')

const as = username => ({ auth: { username, password: '' } })
const NEW_BY_ALICE = 'b1b2c3d4-0002-4000-8000-000000000001'
const SUBMITTED_BY_ALICE = 'b1b2c3d4-0002-4000-8000-000000000002'
const SUBMITTED_BY_CAROL = 'b1b2c3d4-0002-4000-8000-000000000004'
const APPROVED_BY_CAROL = 'b1b2c3d4-0002-4000-8000-000000000003'

describe('Stage 4.1: validation and determination', () => {
  beforeEach(() => cds.test.data.reset())

  it('rejects items with zero quantity', async () => {
    await expect(POST('/odata/v4/request/PurchaseRequests', {
      title: 'Bad request', items: [{ product: 'Mouse', quantity: 0, price: 10 }]
    }, as('alice'))).to.be.rejectedWith(/400.*Quantity must be greater than zero/)
  })

  it('calculates the total from the items', async () => {
    const { data } = await POST('/odata/v4/request/PurchaseRequests', {
      title: 'Keyboards', items: [{ product: 'Keyboard', quantity: 4, price: 25 }, { product: 'Mouse', quantity: 2, price: 10 }]
    }, as('alice'))
    expect(Number(data.total)).to.equal(120)
  })
})

describe('Stage 4.2: submit action', () => {
  beforeEach(() => cds.test.data.reset())

  it('moves a New request to Submitted', async () => {
    await POST(`/odata/v4/request/PurchaseRequests(${NEW_BY_ALICE})/submit`, {}, as('alice'))
    const { data } = await GET(`/odata/v4/request/PurchaseRequests(${NEW_BY_ALICE})`, as('alice'))
    expect(data.status).to.equal('Submitted')
  })

  it('refuses to submit a request that is not New', async () => {
    await expect(POST(`/odata/v4/request/PurchaseRequests(${SUBMITTED_BY_ALICE})/submit`, {}, as('alice')))
      .to.be.rejectedWith(/409/)
  })
})

describe('Stage 4.3: approve action', () => {
  beforeEach(() => cds.test.data.reset())

  it('approves a submitted request', async () => {
    await POST('/odata/v4/approval/approve', { request: SUBMITTED_BY_ALICE, comment: 'ok' }, as('bob'))
    const { data } = await GET('/odata/v4/approval/OpenRequests', as('bob'))
    expect(data.value.map(r => r.ID)).not.to.include(SUBMITTED_BY_ALICE)
  })

  it('refuses to approve a request that is not Submitted', async () => {
    await expect(POST('/odata/v4/approval/approve', { request: APPROVED_BY_CAROL }, as('bob')))
      .to.be.rejectedWith(/409/)
  })

  it('refuses self-approval', async () => {
    await expect(POST('/odata/v4/approval/approve', { request: SUBMITTED_BY_CAROL }, as('carol')))
      .to.be.rejectedWith(/403/)
  })
})
