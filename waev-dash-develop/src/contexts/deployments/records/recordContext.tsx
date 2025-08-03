import { createContext, PropsWithChildren, useContext, useEffect } from 'react';

import { useState } from 'hooks';
import { noop } from 'utils';
import { Group, Deployment } from 'types';
import { SelectedEntityContext } from 'contexts/selectedEntityContext';

interface RecordWithSetter {
  uuidSearchInput: string | '';
  setUuidSearchInput: (uuidSearchInput: string) => void;
  isDisplayUserSearch: boolean | '';
  setIsDisplayUserSearch: (isDisplayUserSearch: boolean) => void;
  selectedEntity: Group | Deployment | undefined;
  setSelectedEntity: (entity: Group | Deployment | undefined) => void;
}

export const RecordContext = createContext<RecordWithSetter>({
  uuidSearchInput: undefined,
  setUuidSearchInput: noop,
  isDisplayUserSearch: false,
  setIsDisplayUserSearch: noop,
  selectedEntity: undefined,
  setSelectedEntity: noop,
});

interface Props {}

export const RecordContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const [uuidSearchInput, setUuidSearchInput] = useState<string | undefined>(undefined);
  const [isDisplayUserSearch, setIsDisplayUserSearch] = useState<boolean | undefined>(undefined);
  const [selectedEntity, setSelectedEntity] = useState<Group | Deployment | undefined>(undefined);

  const { selectedOrganization } = useContext(SelectedEntityContext);

  useEffect(() => {
    setSelectedEntity(undefined);
  }, [selectedOrganization]);

  return (
    <RecordContext.Provider
      value={{
        uuidSearchInput,
        setUuidSearchInput,
        isDisplayUserSearch,
        setIsDisplayUserSearch,
        selectedEntity,
        setSelectedEntity,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};
