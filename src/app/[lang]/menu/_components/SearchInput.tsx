"use client";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

const SearchInput = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { lang } = useParams();
  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/${lang}/menu?query=${searchQuery}`);
  };
  return (
    <div className="flex justify-center items-center  px-4 mb-20">
      <div className="relative w-full max-w-md">
        <form onSubmit={onSubmitSearch}>
          <input
            type="text"
            placeholder="Search Products"
            className="w-full py-3 border border-primary text-lg pl-5 pr-12 rounded-full bg-white text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
            value={searchQuery}
            onChange={onChangeSearchValue}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </form>
      </div>
    </div>
  );
};

export default SearchInput;
