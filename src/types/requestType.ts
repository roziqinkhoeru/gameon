interface DataTableGetRequest {
  search: string;
  page?: number;
  limit?: number;
}
interface StudentAddRequest {
  name: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  media?: File | Blob | any;
}
interface StudentIdRequest {
  id: string;
}
interface SchoolIdRequest {
  id: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type {
  ChangePasswordRequest,
  DataTableGetRequest,
  StudentAddRequest,
  StudentIdRequest,
  SchoolIdRequest,
};
