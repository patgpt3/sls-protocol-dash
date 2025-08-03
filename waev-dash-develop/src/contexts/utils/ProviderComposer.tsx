/**
 * @see https://github.com/FormidableLabs/react-context-composer/blob/master/src/index.js
 */

import React from 'react';

interface Props {
    contexts: React.ReactElement[];
}

export function ProviderComposer ({
  contexts,
  children,
}: React.PropsWithChildren<Props>) {
  return (
        <>
            {contexts.reduceRight(
              // tslint:disable-next-line:no-shadowed-variable
              (children, parent) =>
                parent ? React.cloneElement(parent, { children }) : children,
              children
            )}
        </>
  );
}
