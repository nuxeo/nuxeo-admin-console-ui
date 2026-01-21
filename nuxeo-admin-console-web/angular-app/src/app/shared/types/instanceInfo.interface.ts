export interface InstanceInfo {
    "entity-type": string;
    registered: boolean;
    registrationExpiration: Date;
    instanceType: string;
    contractStatus: string;
    description: string;
    message: string;
    endDate: string;
    CLID: string;
    CTID: string;
    [key: string]: unknown;
}

