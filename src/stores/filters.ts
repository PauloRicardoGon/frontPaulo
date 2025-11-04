import { create } from 'zustand';

interface ClienteFiltersState {
  search: string;
  setSearch: (value: string) => void;
}

interface EquipamentoFiltersState {
  search: string;
  cliente: number | null;
  setSearch: (value: string) => void;
  setCliente: (value: number | null) => void;
}

export const useClienteFilters = create<ClienteFiltersState>((set) => ({
  search: '',
  setSearch: (value) => set({ search: value }),
}));

export const useEquipamentoFilters = create<EquipamentoFiltersState>((set) => ({
  search: '',
  cliente: null,
  setSearch: (value) => set({ search: value }),
  setCliente: (value) => set({ cliente: value }),
}));
