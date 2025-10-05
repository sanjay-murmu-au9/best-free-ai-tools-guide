import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search AI tools..." }: SearchBarProps) {
  console.log('SearchBar value:', value);
  
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          console.log('Input change:', e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => console.log('Input focused')}
        onKeyDown={(e) => console.log('Key pressed:', e.key)}
        className="block w-full pl-10 pr-3 py-3 border-2 border-red-500 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        style={{ 
          backgroundColor: 'white',
          color: 'black',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}