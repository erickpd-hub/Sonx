import { Filter } from "lucide-react";

interface SampleFiltersProps {
  isDark: boolean;
  filters: {
    bpm: string;
    note: string;
    type: string;
    genre: string;
  };
  onFilterChange: (filters: any) => void;
}

export function SampleFilters({ isDark, filters, onFilterChange }: SampleFiltersProps) {
  const bpmRanges = ["Todos", "60-90", "90-120", "120-140", "140-160", "160+"];
  const notes = ["Todos", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const types = ["Todos", "Drums", "Lead", "Pads", "Plucks", "Vocal Chop", "Melodía"];
  const genres = ["Todos", "Hip Hop", "Trap", "Electronic", "R&B", "Pop", "Rock"];

  return (
    <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-4 md:p-6 mb-6`}>
      <div className="flex items-center gap-3 mb-4">
        <Filter className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
        <h4 className={isDark ? 'text-white' : 'text-black'}>FILTROS</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BPM */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block text-sm`}>
            BPM
          </label>
          <select
            value={filters.bpm}
            onChange={(e) => onFilterChange({ ...filters, bpm: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-3 py-2 font-black focus:outline-none`}
          >
            {bpmRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Nota */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block text-sm`}>
            NOTA
          </label>
          <select
            value={filters.note}
            onChange={(e) => onFilterChange({ ...filters, note: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-3 py-2 font-black focus:outline-none`}
          >
            {notes.map((note) => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block text-sm`}>
            TIPO
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-3 py-2 font-black focus:outline-none`}
          >
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Género */}
        <div>
          <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block text-sm`}>
            GÉNERO
          </label>
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-3 py-2 font-black focus:outline-none`}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => onFilterChange({ bpm: "Todos", note: "Todos", type: "Todos", genre: "Todos" })}
        className={`mt-4 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-2 font-black`}
      >
        LIMPIAR FILTROS
      </button>
    </div>
  );
}
