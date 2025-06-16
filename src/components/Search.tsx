// src/Components/Search/Search.tsx
import { Search } from "lucide-react";

const SearchComponent = () => {
  return (
    <div className="flex items-center space-x-2 border bg-gray-100 border-white rounded-lg px-4 py-2">
      <Search className="text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Rechercher..."
        className="
          border-none outline-none bg-transparent text-sm 
          w-[120px] sm:w-[200px] md:w-[400px] lg:w-[800px]
        "
      />
    </div>
  );
};

export default SearchComponent;