using { pr } from '../db/schema';

// TODO Stage 5: only users with the role 'Approver' may use this service (@requires)
@path: 'approval'
service ApprovalService {
  @readonly entity OpenRequests as projection on pr.PurchaseRequests
    where status = 'Submitted';
  action approve(request : UUID, comment : String);
  action reject(request : UUID, comment : String);
}
