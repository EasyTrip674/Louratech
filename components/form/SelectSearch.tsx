"use client"
// import React, { useState, useEffect, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Option = {
  id: string
  label: string,
  price?:number | undefined
}

type SelectSearchProps = {
  options: Option[] | undefined
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  emptyMessage?: string
  error?: string
}

const SelectSearch: React.FC<SelectSearchProps> = ({
  options,
  label,
  placeholder,
  value,
  onChange,
  emptyMessage = "Aucun résultat trouvé",
  error
}) => {

  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  
  // // Récupérer le libellé de l'option sélectionnée
    const selectedLabel = useMemo(() => {
      if (!value) return ""
      const option = options?.find(opt => opt.id === value)
      return option ? option.label : ""
    }, [value, options])

  
  
  // // Filtrer les options selon le terme de recherche
    const filteredOptions = useMemo(() => {
      if (!searchTerm) return options
      
      return options?.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }, [searchTerm, options])
    
    // Fermer le menu déroulant quand on clique ailleurs
    useEffect(() => {
      const handleClickOutside = () => {
        setIsOpen(false)
      }
      
      if (isOpen) {
        document.addEventListener('click', handleClickOutside)
      }
      
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }, [isOpen])
  
  // Réinitialiser la recherche quand la sélection change
  useEffect(() => {
    setSearchTerm("")
  }, [value])
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    setSearchTerm("")
  }
  
  const handleSelect = (id: string) => {
    onChange(id)
    setIsOpen(false)
  }
  
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(true)
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  if (!options) {
    return null;
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-amber-50 mb-1">
        {label}
      </label>
      
      {value ? (
        // Affichage de l'élément sélectionné
        <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          <span className="flex-grow dark:text-warning-25">{selectedLabel}</span>
          <button 
            type="button" 
            onClick={handleClear} 
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4 dark:text-warning-25" />
          </button>
        </div>
      ) : (
        // Interface de recherche
        <div className="relative" onClick={handleSearchClick}>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-white/50" />
            </div>
            <input
              type="text"
              className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border
              dark:bg-gray-800 dark:border-gray-700 dark:text-warning-25"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Menu déroulant des résultats */}
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 max-h-40 overflow-y-auto">
              {filteredOptions &&  filteredOptions.length > 0 ? (
                filteredOptions?.map(option => (
                  <div 
                    key={option.id} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-warning-25"
                    onClick={() => handleSelect(option.id)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 dark:text-warning-25">{emptyMessage}</div>
              )}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default SelectSearch