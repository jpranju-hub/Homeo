import React from 'react';
import { cn } from '../utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
        {...rest}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container };
