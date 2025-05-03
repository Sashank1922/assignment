interface EmployeeDetails {
  id: string;
  name: string;
  email: string;
  organization: string;
  number: string;
  gender: string;
  company: string;
  
}

interface Address {
  id: string; // Unique ID for Address
  street: string;
  city: string;
  state:string;
  zip:string;
}

export interface MainEmployeeDetails {
  employee: EmployeeDetails,
  address: Address[]
}
