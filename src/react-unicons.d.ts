declare module '@iconscout/react-unicons/icons/*' {
  import { FC, SVGProps } from 'react';
  const Icon: FC<SVGProps<SVGSVGElement>>;
  export default Icon;
}

declare module '@iconscout/react-unicons' {
  const content: any;
  export = content;
}
