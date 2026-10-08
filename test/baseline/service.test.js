const cds = require('@sap/cds')
const { GET, expect } = cds.test(__dirname + '/../..')

const as = username => ({ auth: { username, password: '' } })

describe('Baseline: the app starts and serves data', () => {
  it('serves suppliers to a requester', async () => {
    const { data } = await GET('/odata/v4/request/Suppliers', as('alice'))
    expect(data.value).to.have.length(3)
  })

  it('expands items of a purchase request', async () => {
    const { data } = await GET('/odata/v4/request/PurchaseRequests?$expand=items&$filter=title eq \'Monitors\'', as('alice'))
    expect(data.value[0].items).to.have.length(1)
  })

  it('shows only submitted requests to approvers', async () => {
    const { data } = await GET('/odata/v4/approval/OpenRequests', as('bob'))
    expect(data.value.every(r => r.status === 'Submitted')).to.be.true
  })

  it('rejects anonymous users', async () => {
    await expect(GET('/odata/v4/request/Suppliers')).to.be.rejectedWith(/401/)
  })
})
