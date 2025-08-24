import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { debounce } from 'lodash';

type Props = {
  selectedPerson: Person | null;
  delay?: number;
  onSelected: (person: Person | null) => void;
  people: Person[];
};

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
  delay = 300,
  people,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), delay),
    [delay],
  );
  // const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedSetQuery(event.target.value);

    // window.clearTimeout(timerId.current);

    // timerId.current = window.setTimeout(() => {
    //   setAppliedQuery(event.target.value);
    // }, delay)

    if (selectedPerson) {
      onSelected(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  const getFilteredPeople = (humans: Person[]): Person[] => {
    if (!query.trim().toLocaleLowerCase()) {
      return humans;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(query.trim().toLocaleLowerCase()),
    );
  };

  const filteredPeople = getFilteredPeople(people);

  const noMatchingResults =
    query.trim().toLocaleLowerCase() !== '' && filteredPeople.length === 0;

  return (
    <>
      <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {isFocused && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handlePersonSelect(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {noMatchingResults && (
        <div
          className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
