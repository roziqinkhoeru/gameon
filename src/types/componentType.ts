import { ReactNode } from 'react';
import type { Admin, PageResponse, School, Student, User } from './apiType';

// alert dialog
interface AlertDialogProps {
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// button clipboard
interface ButtonClipboardProps {
  linkToCopy: string;
  children: ReactNode;
}

// breadcrumb
interface Breadcrumb {
  icon: string;
  label: string | undefined;
  path: string;
}
interface BreadcrumbState {
  breadcrumbs: Breadcrumb[];
}
interface BreadcrumbIconProps {
  name: string | undefined;
}

// toast
interface ToastState {
  isAllowed: boolean;
}
interface ToastProviderProps {
  children: ReactNode;
}

// header
interface HeaderContainerProps {
  title: string;
  subtitle: string;
  btnHref?: string;
  btnText?: string;
}

// student
interface StudentTableProps {
  student: Student[];
  refetchStudent: () => void;
}

// school
interface SchoolTableProps {
  school: School[];
  refetchSchool: () => void;
}

// profile
interface ProfileUserProps {
  user: User;
}
interface HeaderProfileProps {
  isProfilePage: boolean;
}

export type {
  AlertDialogProps,
  HeaderContainerProps,
  HeaderProfileProps,
  Breadcrumb,
  BreadcrumbState,
  BreadcrumbIconProps,
  ButtonClipboardProps,
  ProfileUserProps,
  SchoolTableProps,
  StudentTableProps,
  ToastState,
  ToastProviderProps,
};
