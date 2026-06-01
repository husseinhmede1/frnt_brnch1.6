export class PageableListOfCardsResponseDto {
  listOfCardsResponseDto!: QuickSearchModel[];
  paginationResponseDto!: PaginationResponseDto;
}
export class PaginationResponseDto {
  asc!: boolean;
  offset!: number;
  pageSize!: number;
  sortBy!: string;
  totalNumberOfRecords!: number;
}
export class QuickSearchModel {
  birthdate?: string;
  branch?: string;
  cardNumber?: string;
  customerId!: number;
  customerName?: string;
  embossingName?: string;
  groupCode?: string;
  expiryDate?: string;
  issueDate?: string;
  maskCardNumber?: string;
  mobile?: string;
  nationalId?: string;
  statusCode?: string;
  statusDescription?: string;
  cardId?: number;
  cardTypeId?: number;
  cardTypeType!: string;
  deliveryBranchId?: number; 
  customerNumber?: string;
  customerTypeId?: number;
  customerTypeDesc?: string;
  passportNumber?: string;
  nationalityDesc?: string;
  nationalityId?: number;
  arabicName?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  cardTypeDesc?: string;
  statusActivityResponseDto?: CustomerActivitiesModel;
  primaryAccountNumber!: string;
  productionIndicator!: string;
  cardTypeDescription!: string;

}

export class CustomerActivitiesModel{
  statusId?: number;
  statusCode?: string;
  statusDescription?: string;
  activities?: Activity[];
}

export class Activity{
  activityId?: number;
  activityCode?: string;
  activityDesc?: string;
}

export class PendingActivityDetailsModel {
  paramClass!: string;
  paramValueJson!: string;
  pendingActivityDetailsId!: number;
}
export class PendingActivityMethod {
  pendingActivityDetails!: PendingActivityDetailsModel[];
}
export class PendingActivitiesModel {
  apiDescription!: string;
  apiObject!: string;
  createdById!: number;
  createdByUser!: string;
  createdDate!: string;
  pendingActivityId!: number;
  pendingActivityMethods!: PendingActivityMethod[];
  relObjId!: number;
  scope!: number;
  status!: string;
  uuid!: string;
  cancelStatus!: boolean;
  approveStatus!: boolean;
  returnStatus!: boolean;
}

export class QuickLinksDashboardDto {
  quickLinkId!: number;
  quickLinkCode!: string;
  quickLinkTitle!: string;
  quickLinkUrl!: string;
  instId!: number;
  status!: string;
  isUserQuickLink!: number;
}
 
export class QuickLinkByInst {
  instId!: number;
  instName?: string;
  quickLinkCode!: string;
  quickLinkId!: number;
  quickLinkTitle!: string;
  quickLinkUrl!: string;
  status!: string;
}

export class QuickLinksDashboardResponseDto {
  userQuickLinksResponseDto!: QuickLinkByUser[];
  quickLinksResponseDto!: QuickLinkByInst[];
}

export class QuickLinkByUser {
  quickLinks!: QuickLinkByInst;
  userId!: number;
  userQlId!: number;
}
export class QuickLinkPost {
  quickLinkId!: number[];
}

export class QuickSearchPostModel {
  arabicName!: string;
  birthdate!: string;
  cardNumber!: string;
  cardtypeId!: number;
  customerNumber!: string;
  customerTypeId!: number;
  embossingName!: string;
  expirydate!: string;
  firstName!: string;
  gender!: string;
  issueDate!: string;
  lastFourDigits!: string;
  lastName!: string;
  mobileNumber!: string;
  nationalId!: string;
  nationalityId!: number|string;
  passportNumber!: string;
  referenceNumber!: string;
  statusId!: number;
  accountNumber!: string;
  fathername?: string;
  middleName?: string;
  paginationRequestDto?: PaginationRequestDto;
  cardtypeType!: number|string;
}

export class PaginationRequestDto {
  asc!: boolean;
  offset!: number;
  pageSize!: number;
  sortBy!: string;
}

export class UserSearchPostModel {
  username!: string;
  firstName!: string;
  lastName!: string;
  mobileNumber!: string;
  email!: string;
  blockReason!: string;
}

export class CardNumberSearch {
  clearCardNumber!: string;
  tokenCardNumber!: string;
  accountNumber!: string;
  cardNumber!: string;
}
