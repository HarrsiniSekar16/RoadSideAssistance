export interface IResponse{
    auth:Boolean;
    token: any;
    user: Iuser;
}

export interface Iuser{
    id:String;
    userType : String;
    userFirstName : String;
    userLastName: String;
    userEmail: String;
    userPassword: String;
    isVerified: Boolean;
    userMobileNumber: Number;
    userGender: Number;
    vendorLicense: String;
    userImage:String;
    vendorLatitude:string;
    vendorLongitude:string;
    distance:string;
    numDistance:string;
    duration:string;
    companyName: string;
}

export interface IUserRequest{
    created_Date: string;
    id: string;
    state: string;
    description: string;
    user: Iuser;
    listOfServices : IListofServices[];
    totalCost: number;
}

export interface IListofServices{
    desc: any;
    estimatedCost : any;
    position:any;
}

export interface userResponse{
    userEmail: String;
    userPassword: String;
}

export interface verificationResponse{
    userEmail: String;
    verificationCode: String;
}