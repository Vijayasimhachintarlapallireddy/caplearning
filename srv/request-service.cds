using { pr } from '../db/schema';

@path: 'request'
@requires: 'authenticated-user'
service RequestService {
  entity PurchaseRequests as projection on pr.PurchaseRequests
    actions { action submit(); };
  @readonly entity Suppliers as projection on pr.Suppliers;
}

annotate RequestService.PurchaseRequests with @(restrict: [
  { grant: ['READ', 'CREATE'], to: 'Requester' },
  { grant: ['UPDATE', 'DELETE', 'submit'], to: 'Requester', where: 'createdBy = $user' }
]);
