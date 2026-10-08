namespace pr;
using { cuid, managed, Currency } from '@sap/cds/common';

entity PurchaseRequests : cuid, managed {
  title      : String(100) @mandatory;
  status     : String(10) enum { New; Submitted; Approved; Rejected } default 'New';
  supplier   : Association to Suppliers;
  currency   : Currency;
  costCenter : String(10);
  total      : Decimal(15,2);
  comment    : String(255);
  items      : Composition of many Items on items.parent = $self;
}

entity Items : cuid {
  parent   : Association to PurchaseRequests;
  product  : String(40);
  quantity : Integer;
  price    : Decimal(15,2);
}

entity Suppliers : cuid {
  name     : String(80);
  country  : String(2);
  requests : Association to many PurchaseRequests on requests.supplier = $self;
}
