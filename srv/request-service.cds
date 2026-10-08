using { pr } from '../db/schema';

@path: 'request'
@requires: 'authenticated-user'
service RequestService {
  entity PurchaseRequests as projection on pr.PurchaseRequests
    actions { action submit(); };
  @readonly entity Suppliers as projection on pr.Suppliers;
}

// TODO Stage 5: restrict PurchaseRequests with @restrict:
//   - Requester may READ and CREATE
//   - Requester may UPDATE, DELETE and submit only their own requests (createdBy = $user)
