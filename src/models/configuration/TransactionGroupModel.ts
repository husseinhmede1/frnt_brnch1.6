export class TransactionGroupModel {
    chargesDetailDtos!: ChargesDetailDtosModel;
    transactionGroupId?: number;
    transactionGroupName!: string;
    transactionGroupDescription!: string;
    institutionId!: string;
    status!: string;
}

export class TransactionGroupChangeStatus {
    id!: number;
    status!: string;
}

export class TransactionsModel {
    transactionId!: string;
    description!: string;
    signFlag!: string;
}

export class TransactionUsageModel extends TransactionsModel {
    transUsage!: string;
    institutionId!:string;
}

export class ChargesDetailDtosModel {
    defaultTransactionId!: string;
    description!: string;
    institutionId!: string;
    transactionChargeDetailsId!: number;
}