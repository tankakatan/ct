import React, {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
} from 'react';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext: FC<PropsWithChildren> = ({children}) => {
    return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
