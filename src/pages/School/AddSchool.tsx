import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2Icon, UploadCloudIcon } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAppDispatch } from '../../app/hooks';
import { setBreadcrumb } from '../../features/breadcrumbSlice';

function AddSchool() {
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    setIsLoadingSave(true);
    setTimeout(() => {
      setIsLoadingSave(false);
    }, 2000);
  };

  useEffect(() => {
    const newBreadcrumb = [
      {
        icon: 'school',
        label: 'School',
        path: '/school',
      },
      {
        icon: 'school_add',
        label: 'Add School',
        path: '/school/add',
      },
    ];
    dispatch(setBreadcrumb(newBreadcrumb));
  }, [dispatch]);

  return (
    <div>
      <div className="mb-6">
        <Breadcrumb />
        <div className="flex items-center justify-between">
          <div className="">
            <h5 className="font-semibold text-3xl mb-1.5">Tambah Sekolah</h5>
            <p className="text-gray-500">
              Tambahkan sekolah baru ke dalam sistem.
            </p>
          </div>
          <div className="flex justify-end">
            <Link
              type="button"
              className={`leading-normal inline-flex justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
                isLoadingSave
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              to="/school">
              Kembali
            </Link>
            <button
              type="button"
              className="leading-normal ml-4 inline-flex justify-center rounded-lg border border-transparent bg-violet-600 px-6 py-3 text-sm font-medium text-gray-100 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-violet-500 disabled:focus-visible:ring-2 disabled:focus-visible:ring-violet-500 disabled:focus-visible:ring-offset-2"
              disabled={isLoadingSave}
              onClick={handleSubmit}>
              {isLoadingSave ? (
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
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full xl:col-span-8">
          <div className="bg-white rounded-xl">
            <div className="px-5 pt-4">
              <h4 className="font-semibold text-xl mb-0.5">
                Informasi Sekolah
              </h4>
              <p className="text-gray-500">
                Informasi sekolah yang akan ditambahkan ke dalam sistem.
              </p>
            </div>
            <div className="p-5">
              <form
                action=""
                className="block">
                {/* name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block mb-2 font-medium text-gray-500">
                    Nama Sekolah
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`px-3 py-2.5 rounded-lg border bg-gray-50 border-gray-300 w-full focus:bg-white focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-indigo-500/30 focus:border-indigo-500/80`}
                    placeholder="Masukkan nama sekolah"
                    aria-required="true"
                    aria-invalid="false"
                  />
                </div>
                {/* address */}
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block mb-2 font-medium text-gray-500">
                    Alamat
                  </label>
                  <textarea
                    id="address"
                    className={`px-3 py-2.5 rounded-lg border bg-gray-50 border-gray-300 w-full focus:bg-white focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-indigo-500/30 focus:border-indigo-500/80`}
                    placeholder="Masukkan alamat sekolah"
                    aria-required="true"
                    aria-invalid="false"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-full xl:col-span-4">
          <div className="bg-white rounded-xl">
            <div className="px-5 pt-4">
              <h4 className="font-semibold text-xl mb-0.5">Foto Sekolah</h4>
              <p className="text-gray-500">
                Tambahkan foto sekolah yang akan ditampilkan di halaman sekolah.
              </p>
            </div>
            <div className="p-5">
              <form
                action=""
                className="block">
                <input
                  id="profileImg"
                  name="profileImg"
                  type="file"
                  className="hidden opacity-0 invisible"
                />
                <div className="cursor-pointer w-full p-4 border-2 border-dashed border-gray-300 rounded-md flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-50 mt-1 mb-4">
                    <UploadCloudIcon
                      size={24}
                      className="text-gray-500"
                    />
                  </div>
                  <p className="text-gray-500">
                    <label
                      className="inline-block text-violet-500 cursor-pointer hover:underline underline-offset-2"
                      htmlFor="profileImg">
                      Click to upload
                    </label>{' '}
                    or drag and drop
                  </p>
                  <p className="text-gray-500">
                    SVG, PNG, or JPG (max. 3.00 MB)
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSchool;
