using { pr } from '../db/schema';

@path: 'approval'
@requires: 'Approver'
service ApprovalService {
  @readonly entity OpenRequests as projection on pr.PurchaseRequests
    where status = 'Submitted';
  action approve(request : UUID, comment : String);
  action reject(request : UUID, comment : String);
}
