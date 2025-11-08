declare module '@monaco-editor/react' {
  import * as React from 'react';

  export interface MonacoEditorProps {
    height?: string | number;
    language?: string;
    theme?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string | undefined, ev: any) => void;
    options?: any;
  }

  const Editor: React.ForwardRefExoticComponent<MonacoEditorProps & React.RefAttributes<unknown>>;
  export function useMonaco(): any;
  export default Editor;
}
