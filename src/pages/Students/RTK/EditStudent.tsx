import { useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronDownIcon, Loader2Icon, UploadCloudIcon } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';
import { useAppDispatch } from '../../../app/hooks';
import { setBreadcrumb } from '../../../features/breadcrumbSlice';
import {
  useGetStudentByIdMutation,
  useUpdateStudentMutation,
} from '../../../services/studentApi';
import { showErrorToast, showSuccessToast } from '../../../components/Toast';
import { setAllowedToast } from '../../../features/toastSlice';

import { StudentAddRequest } from '../../../types';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const schema = yup.object().shape({
  name: yup.string().required('Nama harus diisi'),
  email: yup.string().required('Email harus diisi').email('Email tidak valid'),
  phoneNumber: yup.string().required('Nomor telepon harus diisi'),
  schoolId: yup.string().required('Sekolah harus diisi'),
  media: yup.mixed().test({
    name: 'fileSize',
    message: 'File terlalu besar',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test: (value: any) => {
      if (!value?.length) return true;
      return value[0]?.size <= MAX_FILE_SIZE;
    },
  }),
});

function EditStudent() {
  const mediaRef = useRef<HTMLImageElement>(null);
  const refInitMount = useRef(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { studentId } = useParams();
  const [getStudentById, { isLoading: isLoadingGet, isSuccess: isSuccessGet }] =
    useGetStudentByIdMutation();
  const [updateStudent, { isLoading: isLoadingUpdate }] =
    useUpdateStudentMutation();
  let content;

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<StudentAddRequest>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValue('media', acceptedFiles);
    },
    [setValue]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg'] },
    multiple: false,
  });

  const watchMedia = watch('media');
  const handleApplyMedia = () => {
    if (mediaRef.current && watchMedia?.length > 0 && !errors.media) {
      mediaRef.current.src = URL.createObjectURL(watchMedia[0]);
    }
  };
  const handleDeleteMedia = () => setValue('media', null);

  const fetchStudentById = async (id: string) => {
    try {
      const response = await getStudentById({ id }).unwrap();
      if (response.success) {
        setValue('name', response.data.name);
        setValue('email', response.data.email);
        setValue('phoneNumber', response.data.phoneNumber);
        setValue('schoolId', response.data.school._id);
      }
    } catch (error) {
      showErrorToast('Gagal mengambil data siswa');
    }
  };

  const onSubmit: SubmitHandler<StudentAddRequest> = async (data) => {
    try {
      await updateStudent(data).unwrap();
      dispatch(setAllowedToast());
      showSuccessToast('Data siswa berhasil diperbarui!');
      navigate('/student');
    } catch (error) {
      showErrorToast('Data siswa gagal disimpan');
    }
  };

  useEffect(() => {
    const newBreadcrumb = [
      {
        icon: 'student',
        label: 'Students',
        path: '/student',
      },
      {
        icon: 'edit',
        label: 'Edit Student',
        path: `/student/edit/${studentId}`,
      },
    ];
    dispatch(setBreadcrumb(newBreadcrumb));
  }, [dispatch, studentId]);
  useEffect(() => {
    if (refInitMount.current) {
      refInitMount.current = false;
      return;
    }
    if (!studentId) {
      navigate('/student');
      return;
    } else {
      fetchStudentById(studentId);
    }
  }, [studentId]);

  if (isLoadingGet) {
    content = (
      <div>
        <svg
          className="animate-spin-fast -ml-1 mr-3 h-5 w-5 text-neutral-800 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  } else if (isSuccessGet) {
    content = (
      <form className="grid grid-cols-12 gap-6">
        <div className="col-span-full xl:col-span-8">
          <div className="bg-white rounded-xl">
            <div className="px-5 pt-4">
              <h4 className="font-semibold text-xl mb-0.5">Informasi Siswa</h4>
              <p className="text-gray-500">
                Informasi siswa yang akan ditambahkan ke dalam sistem.
              </p>
            </div>
            <div className="p-5">
              <div>
                {/* name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block mb-2 font-medium text-gray-500">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`px-3 py-2.5 rounded-lg border bg-gray-50 border-gray-300 w-full focus:bg-white focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-indigo-500/30 focus:border-indigo-500/80 ${
                      errors.name
                        ? 'bg-red-50 border-red-400 focus:outline-red-500/30 focus:border-red-500'
                        : ''
                    }`}
                    placeholder="Masukkan nama siswa"
                    aria-required="true"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 -mb-1.5 text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-gray-500">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`px-3 py-2.5 rounded-lg border bg-gray-50 border-gray-300 w-full focus:bg-white focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-indigo-500/30 focus:border-indigo-500/80 ${
                      errors.email
                        ? 'bg-red-50 border-red-400 focus:outline-red-500/30 focus:border-red-500'
                        : ''
                    }`}
                    placeholder="Masukkan email siswa"
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 -mb-1.5 text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* phone number */}
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block mb-2 font-medium text-gray-500">
                    Nomor Telepon
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className={`px-3 py-2.5 rounded-lg border bg-gray-50 border-gray-300 w-full focus:bg-white focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-indigo-500/30 focus:border-indigo-500/80 ${
                      errors.phoneNumber
                        ? 'bg-red-50 border-red-400 focus:outline-red-500/30 focus:border-red-500'
                        : ''
                    }`}
                    placeholder="Masukkan nomor telepon siswa"
                    aria-required="true"
                    aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 -mb-1.5 text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                {/* school::select */}
                <div className="mb-1">
                  <label
                    htmlFor="school"
                    className="block mb-2 font-medium text-gray-500">
                    Sekolah
                  </label>
                  <div className="relative">
                    <select
                      id="school"
                      className={`h-[43.2px] px-3 py-2.5 rounded-lg border bg-gray-50 border-gray-300 w-full appearance-none focus:bg-white focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-indigo-500/30 focus:border-indigo-500/80 ${
                        errors.schoolId
                          ? 'bg-red-50 border-red-400 focus:outline-red-500/30 focus:border-red-500'
                          : ''
                      }`}
                      aria-required="true"
                      aria-invalid={errors.schoolId ? 'true' : 'false'}
                      {...register('schoolId')}>
                      <option value="">Pilih Sekolah</option>
                      <option value="65a56e7fc5a51e008c5b4909">
                        TK Tadika Mesra
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-1 flex items-center px-2 pointer-events-none">
                      <ChevronDownIcon
                        size={18}
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                  {errors.schoolId && (
                    <p className="mt-1 -mb-1.5 text-red-500">
                      {errors.schoolId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full xl:col-span-4">
          <div className="bg-white rounded-xl">
            <div className="px-5 pt-4">
              <h4 className="font-semibold text-xl mb-0.5">Foto Profil</h4>
              <p className="text-gray-500">
                Foto profil siswa yang akan ditambahkan ke dalam sistem.
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center mb-4">
                <figure className="flex items-center justify-center overflow-hidden w-14 h-14 rounded-full mr-3">
                  <img
                    ref={mediaRef}
                    src={
                      !errors.media && watchMedia?.length > 0
                        ? URL.createObjectURL(watchMedia[0])
                        : 'https://ui-avatars.com/api/?name=Gameon'
                    }
                    alt="Profile Placeholder"
                    className="w-full h-full object-cover object-center"
                  />
                </figure>
                <div className="">
                  <h5 className="font-medium text-base mb-0.5">
                    Tambah Foto Profil
                  </h5>
                  <div className="flex items-center space-x-3">
                    <p
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={handleDeleteMedia}>
                      Hapus
                    </p>
                    <p
                      className="text-violet-600 hover:text-violet-500 cursor-pointer"
                      onClick={handleApplyMedia}>
                      Terapkan
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={`group drop-media cursor-pointer w-full p-4 border-2 border-dashed rounded-md flex flex-col justify-center items-center ${
                    isDragActive
                      ? 'border-gray-600 bg-neutral-200'
                      : 'border-gray-300'
                  }`}>
                  <input
                    {...getInputProps()}
                    name="media"
                    id="media"
                    accept="image/*"
                  />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-50 mt-1 mb-4">
                    <UploadCloudIcon
                      size={24}
                      className="text-gray-500"
                    />
                  </div>
                  <p className="text-gray-500">
                    <span className="inline-block text-violet-500 cursor-pointer hover:underline underline-offset-2">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-gray-500">
                    SVG, PNG, or JPG (max. 3.00 MB)
                  </p>
                </div>
              </div>
              {watchMedia?.length > 0 && errors.media && (
                <p className="mt-1 text-red-500">
                  {errors.media.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Breadcrumb />
        <div className="flex items-center justify-between">
          <div className="">
            <h5 className="font-semibold text-3xl mb-1.5">Edit Siswa</h5>
            <p className="text-gray-500">Edit data siswa.</p>
          </div>
          <div className="flex justify-end">
            <Link
              type="button"
              className={`leading-normal inline-flex justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
                isLoadingUpdate
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              to="/student">
              Kembali
            </Link>
            <button
              type="button"
              className="leading-normal ml-4 inline-flex justify-center rounded-lg border border-transparent bg-violet-600 px-6 py-3 text-sm font-medium text-gray-100 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-violet-500 disabled:focus-visible:ring-2 disabled:focus-visible:ring-violet-500 disabled:focus-visible:ring-offset-2"
              disabled={isLoadingUpdate}
              onClick={handleSubmit(onSubmit)}>
              {isLoadingUpdate ? (
                <>
                  <span className="translate-y-[1px]">
                    <Loader2Icon
                      size={18}
                      className="mr-1.5 animate-spin-fast"
                    />
                  </span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                'Simpan'
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="">{content}</div>
    </div>
  );
}

export default EditStudent;