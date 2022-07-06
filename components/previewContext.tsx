import React from 'react';

export interface PreviewProps {
    preview: boolean;
}

export const PreviewContext = React.createContext<PreviewProps>({ preview: false });