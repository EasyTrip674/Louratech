export const UserElementInfo = ({ label, value }: { label: string, value?: string | null }) => {
    return (
      value ?   
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {value}
          </p>
        </div>
      : null
    );
  };
  